// js/calendarView.js (FINAL version)

import { getEventOccurrencesForDate } from "./recurrence.js";
import { openModal } from "./eventModal.js";
import { handleEditEvent } from "./index.js";

// Get DOM elements once at the top
const calendarGrid = document.getElementById("calendar-grid");
const monthYearDisplay = document.getElementById("month-year-display");
const printHeader = document.getElementById("print-header");

/**
 * Renders the full calendar for a given date and set of events.
 * @param {Date} date The date indicating the month and year to render.
 * @param {Array} events The array of all events.
 */
export function renderCalendar(date, events) {
  // Clear the grid before drawing
  calendarGrid.innerHTML = "";

  const month = date.getMonth();
  const year = date.getFullYear();

  // Set the header text
  const monthYearText = `${date.toLocaleString("default", {
    month: "long",
  })} ${year}`;
  monthYearDisplay.textContent = monthYearText;
  printHeader.textContent = monthYearText;

  // Calculate the exact start and end dates for the grid display
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  if (endDate.getDay() !== 6) {
    // Ensure the grid always ends on a Saturday
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  }

  // Loop through the dates and create a cell for each one
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayCell = createDayCell(currentDate, month, events);
    calendarGrid.appendChild(dayCell);
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

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

  const occurrences = getEventOccurrencesForDate(date, allEvents);
  occurrences
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""))
    .forEach((event) => {
      const eventPill = document.createElement("div");
      eventPill.className = "event-pill";
      eventPill.textContent = event.title;
      eventPill.style.backgroundColor = event.color;
      eventPill.dataset.eventId = event.id;
      eventPill.addEventListener("click", (e) => {
        e.stopPropagation();
        handleEditEvent(event.id);
      });
      eventsContainer.appendChild(eventPill);
    });

  dayCell.appendChild(eventsContainer);
  return dayCell;
}
