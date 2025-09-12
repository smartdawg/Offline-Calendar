import { sampleEvents } from "./calendarData.js";

const STORAGE_KEY = "vanillaCalendarEvents";

/**
 * Initializes storage with sample data if it's empty.
 */
function initializeStorage() {
  const events = localStorage.getItem(STORAGE_KEY);
  if (!events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
  }
}

/**
 * Retrieves all events from localStorage.
 * @returns {Promise<Array>} A promise that resolves with the array of events.
 */
export function getEvents() {
  return new Promise((resolve) => {
    initializeStorage();
    const eventsJSON = localStorage.getItem(STORAGE_KEY);
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];
    resolve(events);
  });
}

/**
 * Adds a new event to localStorage.
 * @param {object} eventData The event data to add.
 * @returns {Promise<object>} A promise that resolves with the newly created event.
 */
export async function addEvent(eventData) {
  const events = await getEvents();
  const newEvent = {
    ...eventData,
    id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
  };
  events.push(newEvent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  return newEvent;
}

/**
 * Updates an existing event in localStorage.
 * @param {object} updatedEventData The updated event data.
 * @returns {Promise<object>} A promise that resolves with the updated event.
 */
export async function updateEvent(updatedEventData) {
  let events = await getEvents();
  const eventIndex = events.findIndex(
    (event) => event.id === updatedEventData.id
  );
  if (eventIndex !== -1) {
    events[eventIndex] = updatedEventData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return updatedEventData;
  }
  throw new Error("Event not found");
}

/**
 * Deletes an event from localStorage.
 * @param {string} eventId The ID of the event to delete.
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId) {
  let events = await getEvents();
  const filteredEvents = events.filter((event) => event.id !== eventId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
}
