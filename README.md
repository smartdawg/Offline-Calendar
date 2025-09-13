# Offline-First Personal Calendar

A complete, world-class, personal calendar application built with vanilla JavaScript and a Python WebSocket backend. This single-page application runs entirely in the browser, using a local `events.json` file for persistent storage, enabling real-time updates.

![Calendar Screenshot](placeholder.png)
_(Note: You can replace `placeholder.png` with an actual screenshot of your application)_

---

## Table of Contents

- [Offline-First Personal Calendar](#offline-first-personal-calendar)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Installation \& Setup](#installation--setup)
  - [How It Works](#how-it-works)
  - [API Overview](#api-overview)
  - [Future Enhancements](#future-enhancements)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- **Full Monthly Calendar View**: A clean, responsive grid view of the entire month.
- **Dynamic Navigation**: Easily navigate to the next/previous month or jump to the "Today" view.
- **Complete Event Management (CRUD)**:
  - **Create**: Add new events via a clean modal interface.
  - **Read**: View event details by clicking on them.
  - **Update**: Edit existing events, including title, dates, times, color, and more.
  - **Delete**: Remove events with a confirmation step.
- **Real-Time Updates**: Changes are instantly reflected via a WebSocket connection to the backend server.
- **Persistent File Storage**: All event data is stored in a local `events.json` file, making the data portable and easy to back up.
- **Recurring Events**: Set events to repeat daily, weekly, monthly, or yearly until a specified end date.
- **Live Search**: Instantly search through all event titles, descriptions, and locations as you type.
- **Print-Friendly**: A dedicated print stylesheet generates a clean, paper-friendly version of the current month's view.

---

## Technology Stack

This project was built with a strict adherence to simplicity and foundational technologies.

- **Frontend**:
  - **JavaScript**: Vanilla ES6+ (Modular)
  - **HTML5**: Standard semantic markup
  - **CSS3**: Modern, responsive design using Flexbox and Grid
- **Backend**:
  - **Python 3**: For the local server logic.
  - **`websockets` Library**: For real-time, bidirectional communication.
  - **`asyncio`**: To handle asynchronous server operations.
- **Data Storage**:
  - **JSON**: A simple `events.json` file acts as the database.
- **Constraint Adherence**:
  - **No Frameworks**: Does not use React, Vue, Angular, or any other frontend framework.
  - **No Build Tools**: Runs directly in the browser without requiring a bundler like Webpack or Vite.

---

## Project Structure

```/personal-calendar
|-- .gitignore           # Tells Git which files to ignore
|-- README.md            # You are here!
|-- calendar.css         # All styles for the application
|-- events.json          # The "database" where events are stored
|-- index.html           # The single HTML entry point for the app
|-- server.py            # The Python WebSocket and HTTP server
|-- js/
|   |-- index.js         # Main application logic and state management
|   |-- calendarAPI.js   # Manages WebSocket communication with the server
|   |-- calendarView.js  # Renders the calendar grid and events
|   |-- eventModal.js    # Manages the create/edit event modal
|   |-- searchModal.js   # Manages the search results modal
|   |-- recurrence.js    # Logic for calculating recurring event dates
```

---

## Prerequisites

- [Python 3.7+](https://www.python.org/downloads/)
- The `websockets` Python library
- A modern web browser (e.g., Chrome, Firefox, Edge)

---

## Installation & Setup

Follow these steps to get the application running on your local machine.

1.  **Clone the repository (or download the files):**

    ```bash
    git clone https://your-repo-url/personal-calendar.git
    cd personal-calendar
    ```

2.  **Install the required Python library:**

    ```bash
    pip install websockets
    ```

3.  **Run the server:**
    Open your terminal in the project's root directory and run the Python script.

    ```bash
    python server.py
    ```

    You will see confirmation that both the HTTP and WebSocket servers have started on ports 8000 and 8001, respectively.

4.  **Open the application:**
    Open your web browser and navigate to:
    **[http://localhost:8000](http://localhost:8000)**

The calendar should now be fully operational. Any changes you make will be saved in real-time to the `events.json` file.

---

## How It Works

The application is architected with a clear separation of concerns, using a local Python server to enable file-based persistence.

1.  The Python `server.py` script starts two servers on separate threads:
    - An **HTTP Server** on port 8000 serves the static files (`index.html`, `css`, `js`).
    - A **WebSocket Server** on port 8001 manages the real-time data connection.
2.  When the browser loads `index.html`, the `index.js` script initializes a WebSocket connection to the server.
3.  Upon successful connection, the server reads the `events.json` file and pushes the entire list of events to the browser.
4.  The browser receives the event list and renders the calendar view.
5.  When a user performs an action (e.g., adds an event), a message is sent to the WebSocket server with the action type (`addEvent`) and its data (the new event details).
6.  The server processes the message, updates the `events.json` file, and then **broadcasts** the new, complete list of events to all connected clients.
7.  The browser receives this broadcasted update and re-renders the calendar view, ensuring the UI is always in sync with the data file.

---

## API Overview

Communication between the frontend and backend is handled via WebSocket messages managed by `calendarAPI.js`. All messages are JSON objects with an `action` and a `payload`.

**Client to Server Messages:**

- `{"action": "addEvent", "payload": {eventObject}}`
- `{"action": "updateEvent", "payload": {eventObject}}`
- `{"action": "deleteEvent", "payload": {"id": "eventId"}}`

**Server to Client Messages:**

- `{"type": "update", "events": [eventArray]}`

---

## Future Enhancements

This project provides a solid foundation. Potential features to add in the future include:

- **Additional Views**: Implement Week and Day calendar views.
- **Drag and Drop**: Allow users to reschedule events by dragging them to a new date.
- **Notifications**: Implement browser-based notifications for upcoming events.
- **Theming**: Add a dark mode and other color themes.
- **iCal Import/Export**: Add functionality to import and export events using the standard `.ics` format.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/your-repo/issues) if you want to contribute.

---

## License

This project is licensed under the MIT License.
