let websocket = null;

/**
 * Initializes the WebSocket connection and sets up event listeners.
 * @param {function} onUpdate - The function to call when new event data arrives from the server.
 */
// THE 'export' KEYWORD WAS MISSING FROM THE LINE BELOW. IT IS NOW ADDED.
export function initWebSocket(onUpdate) {
  const WS_URL = "ws://localhost:8001";
  websocket = new WebSocket(WS_URL);

  websocket.onopen = () => {
    console.log("WebSocket connection established.");
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update" && data.events) {
      console.log("Received event update from server.");
      onUpdate(data.events); // Call the callback with the new event list
    }
  };

  websocket.onclose = () => {
    console.log("WebSocket connection closed. Attempting to reconnect...");
    // Simple reconnect logic
    setTimeout(() => initWebSocket(onUpdate), 3000);
  };

  websocket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

/**
 * Sends a message to the server to perform an action.
 * @param {string} action - The action to perform (e.g., 'addEvent').
 * @param {object} payload - The data associated with the action.
 */
function sendMessage(action, payload) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify({ action, payload }));
  } else {
    console.error("WebSocket is not connected.");
  }
}

// The API functions now just send messages and don't expect a direct response.
// The UI update is handled by the `onmessage` listener.

export function addEvent(eventData) {
  sendMessage("addEvent", eventData);
}

export function updateEvent(eventData) {
  sendMessage("updateEvent", eventData);
}

export function deleteEvent(eventId) {
  sendMessage("deleteEvent", { id: eventId });
}
