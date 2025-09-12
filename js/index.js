import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "./calendarAPI.js";
import { renderCalendar } from "./calendarView.js";
import {
  openModal as openEventModal,
  closeModal as closeEventModal,
  populateEventForm,
} from "./eventModal.js";
import {
  openModal as openSearchModal,
  renderSearchResults,
} from "./searchModal.js";

// --- STATE MANAGEMENT ---
const state = {
  currentDate: new Date(),
  events: [],
};

// --- DOM ELEMENTS ---
const prevMonthBtn = document.getElementById("prev-month-btn");
const nextMonthBtn = document.getElementById("next-month-btn");
const todayBtn = document.getElementById("today-btn");
const createEventBtn = document.getElementById("create-event-btn");
const printBtn = document.getElementById("print-btn");
const searchInput = document.getElementById("search-input");

// --- EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", initializeAapp);
prevMonthBtn.addEventListener("click", () => changeMonth(-1));
nextMonthBtn.addEventListener("click", () => changeMonth(1));
todayBtn.addEventListener("click", goToToday);
createEventBtn.addEventListener("click", () => openEventModal());
printBtn.addEventListener("click", () => window.print());

let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = e.target.value;
    if (query.length > 1) {
      performSearch(query);
    }
  }, 300);
});

// --- APPLICATION LOGIC ---

/**
 * Initializes the application, fetches events, and renders the calendar.
 */
async function initializeAapp() {
  await fetchEvents();
  render();
}

/**
 * Fetches all events from the API and stores them in the state.
 */
async function fetchEvents() {
  state.events = await getEvents();
}

/**
 * Main render function to update the UI.
 */
function render() {
  renderCalendar(state.currentDate, state.events);
}

/**
 * Changes the currently viewed month.
 * @param {number} direction - -1 for previous month, 1 for next month.
 */
function changeMonth(direction) {
  state.currentDate.setMonth(state.currentDate.getMonth() + direction);
  render();
}

/**
 * Sets the calendar view to the current month.
 */
function goToToday() {
  state.currentDate = new Date();
  render();
}

/**
 * Performs a search on events and displays the results.
 * @param {string} query The search term.
 */
function performSearch(query) {
  const lowerCaseQuery = query.toLowerCase();
  const results = state.events.filter(
    (event) =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      (event.description &&
        event.description.toLowerCase().includes(lowerCaseQuery)) ||
      (event.location && event.location.toLowerCase().includes(lowerCaseQuery))
  );
  renderSearchResults(results);
  openSearchModal();
}

/**
 * Handles saving an event (both creating and updating).
 * @param {object} eventData The event data from the form.
 */
export async function handleSaveEvent(eventData) {
  if (eventData.id) {
    await updateEvent(eventData);
  } else {
    await addEvent(eventData);
  }
  await fetchEvents();
  render();
  closeEventModal();
}

/**
 * Handles deleting an event.
 * @param {string} eventId The ID of the event to delete.
 */
export async function handleDeleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event?")) {
    await deleteEvent(eventId);
    await fetchEvents();
    render();
    closeEventModal();
  }
}

/**
 * Handles clicking on an event to edit it.
 * @param {string} eventId The ID of the event to edit.
 */
export function handleEditEvent(eventId) {
  const event = state.events.find((e) => e.id === eventId);
  if (event) {
    populateEventForm(event);
    openEventModal(event);
  }
}
