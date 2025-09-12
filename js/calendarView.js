import { getEventOccurrencesForDate } from "./recurrence.js";
import { openModal } from "./eventModal.js";
import { handleEditEvent } from "./index.js";

const calendarGrid = document.getElementById("calendar-grid");
const monthYearDisplay = document.getElementById("month-year-display");
const printHeader = document.getElementById("print-header");

/**
 * Renders the full calendar for a given date and set of events.
 * @param {Date} date The date indicating the month and year to render.
 * @param {Array} events The array of all events.
 */
// In js/calendarView.js

/**
 * Renders the full calendar for a given date and set of events.
 * @param {Date} date The date indicating the month and year to render.
 * @param {Array} events The array of all events.
 */
export function renderCalendar(date, events) {
  calendarGrid.innerHTML = "";
  const month = date.getMonth();
  const year = date.getFullYear();

  // --- THIS IS THE CORRECTED SECTION ---
  // 1. Create the variable that holds the month and year string
  const monthYearText = `${date.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  // 2. Use that variable for both the screen display and the print header
  monthYearDisplay.textContent = monthYearText;
  printHeader.textContent = monthYearText;
  // --- END OF CORRECTION ---

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  }

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayCell = createDayCell(currentDate, month, events);
    calendarGrid.appendChild(dayCell);
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// ... the rest of the file (createDayCell function) remains exactly the same ...
/**
 * Creates a single day cell for the calendar grid.
 * @param {Date} date The date for the cell.
 * @param {number} currentMonth The month being displayed.
 * @param {Array} allEvents The array of all events.
 * @returns {HTMLElement} The created day cell element.
 */
function createDayCell(date, currentMonth, allEvents) {
  const dayCell = document.createElement("div");
  dayCell.className = "calendar-day";

  const dateString = date.toISOString().split("T")[0];
  dayCell.dataset.date = dateString;
  dayCell.addEventListener("click", (e) => {
    if (e.target === dayCell || e.target.classList.contains("day-number")) {
      openModal(null, dateString);
    }
  });

  if (date.getMonth() !== currentMonth) {
    dayCell.classList.add("other-month");
  }

  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    dayCell.classList.add("current-day");
  }

  const dayNumber = document.createElement("div");
  dayNumber.className = "day-number";
  dayNumber.textContent = date.getDate();
  dayCell.appendChild(dayNumber);

  const eventsContainer = document.createElement("div");
  eventsContainer.className = "events-container";

  // Get event occurrences for this specific date
  const occurrences = getEventOccurrencesForDate(date, allEvents);
  occurrences
    .sort((a, b) => a.startTime?.localeCompare(b.startTime || "") || 0)
    .forEach((event) => {
      const eventPill = document.createElement("div");
      eventPill.className = "event-pill";
      eventPill.textContent = event.title;
      eventPill.style.backgroundColor = event.color;
      eventPill.dataset.eventId = event.id;
      eventPill.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent day cell click
        handleEditEvent(event.id);
      });
      eventsContainer.appendChild(eventPill);
    });

  dayCell.appendChild(eventsContainer);
  return dayCell;
}
