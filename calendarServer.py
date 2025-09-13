import asyncio
import websockets
import json
import os
import http.server
import socketserver
import threading

HTTP_PORT = 8000
WS_PORT = 8001
EVENTS_FILE = 'events.json'

# --- WebSocket Logic ---

CONNECTED_CLIENTS = set()

def read_events():
    """Reads events from the JSON file."""
    if not os.path.exists(EVENTS_FILE):
        return []
    with open(EVENTS_FILE, 'r') as f:
        return json.load(f)

def write_events(events_data):
    """Writes events to the JSON file."""
    with open(EVENTS_FILE, 'w') as f:
        json.dump(events_data, f, indent=4)

async def broadcast_updates():
    """Sends the latest event list to all connected clients."""
    if not CONNECTED_CLIENTS:
        return
    message = json.dumps({"type": "update", "events": read_events()})
    # asyncio.wait doesn't suit the new version of websockets, use gather
    await asyncio.gather(*[client.send(message) for client in CONNECTED_CLIENTS])


async def handle_websocket(websocket):
    """Handles a single client's WebSocket connection."""
    CONNECTED_CLIENTS.add(websocket)
    print(f"Client connected. Total clients: {len(CONNECTED_CLIENTS)}")
    try:
        # Send the initial list of events upon connection
        await websocket.send(json.dumps({"type": "update", "events": read_events()}))
        
        # Listen for messages from the client
        async for message in websocket:
            data = json.loads(message)
            action = data.get('action')
            payload = data.get('payload')
            
            events = read_events()
            
            if action == 'addEvent':
                new_event = {
                    **payload,
                    "id": f"evt_{int(asyncio.get_running_loop().time())}"
                }
                events.append(new_event)
                write_events(events)
                await broadcast_updates()
                
            elif action == 'updateEvent':
                events = [payload if e['id'] == payload['id'] else e for e in events]
                write_events(events)
                await broadcast_updates()

            elif action == 'deleteEvent':
                event_id = payload.get('id')
                events = [e for e in events if e['id'] != event_id]
                write_events(events)
                await broadcast_updates()
                
    except websockets.exceptions.ConnectionClosedError:
        print("Client connection closed.")
    finally:
        CONNECTED_CLIENTS.remove(websocket)
        print(f"Client disconnected. Total clients: {len(CONNECTED_CLIENTS)}")

async def start_ws_server():
    async with websockets.serve(handle_websocket, "localhost", WS_PORT):
        print(f"WebSocket server started on ws://localhost:{WS_PORT}")
        await asyncio.Future()  # run forever

# --- HTTP Server Logic (for serving files) ---

def start_http_server():
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", HTTP_PORT), handler) as httpd:
        print(f"HTTP server started on http://localhost:{HTTP_PORT}")
        httpd.serve_forever()

# --- Main Execution ---

if __name__ == "__main__":
    print("Starting servers...")
    # Run HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server)
    http_thread.daemon = True
    http_thread.start()

    # Run WebSocket server in the main thread
    try:
        asyncio.run(start_ws_server())
    except KeyboardInterrupt:
        print("Servers shutting down.")