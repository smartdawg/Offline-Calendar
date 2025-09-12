import { handleSaveEvent, handleDeleteEvent } from "./index.js";

const modal = document.getElementById("event-modal");
const closeModalBtn = document.getElementById("close-event-modal");
const eventForm = document.getElementById("event-form");
const modalTitle = document.getElementById("modal-title");
const deleteBtn = document.getElementById("delete-event-btn");
const recurrenceRuleSelect = document.getElementById("recurrence-rule");
const recurrenceUntilGroup = document.getElementById("recurrence-until-group");

// Form Fields
const eventIdField = document.getElementById("event-id");
const titleField = document.getElementById("event-title");
const startDateField = document.getElementById("start-date");
const endDateField = document.getElementById("end-date");
const startTimeField = document.getElementById("start-time");
const endTimeField = document.getElementById("end-time");
const locationField = document.getElementById("event-location");
const colorField = document.getElementById("event-color");
const descriptionField = document.getElementById("event-description");
const recurrenceUntilField = document.getElementById("recurrence-until");

// --- EVENT LISTENERS ---
closeModalBtn.onclick = () => closeModal();
window.onclick = (event) => {
  if (event.target == modal) {
    closeModal();
  }
};

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const eventData = {
    id: eventIdField.value || null,
    title: titleField.value,
    startDate: startDateField.value,
    endDate: endDateField.value,
    startTime: startTimeField.value,
    endTime: endTimeField.value,
    location: locationField.value,
    color: colorField.value,
    description: descriptionField.value,
    recurrence: {
      rule: recurrenceRuleSelect.value,
      until:
        recurrenceRuleSelect.value !== "none"
          ? recurrenceUntilField.value
          : null,
    },
  };
  handleSaveEvent(eventData);
});

deleteBtn.addEventListener("click", () => {
  const eventId = eventIdField.value;
  if (eventId) {
    handleDeleteEvent(eventId);
  }
});

recurrenceRuleSelect.addEventListener("change", () => {
  recurrenceUntilGroup.style.display =
    recurrenceRuleSelect.value === "none" ? "none" : "block";
});

// --- FUNCTIONS ---
export function openModal(event = null, dateString = null) {
  eventForm.reset();
  recurrenceUntilGroup.style.display = "none";

  if (event) {
    modalTitle.textContent = "Edit Event";
    populateEventForm(event);
    deleteBtn.style.display = "block";
  } else {
    modalTitle.textContent = "Create Event";
    eventIdField.value = "";
    startDateField.value = dateString || new Date().toISOString().split("T")[0];
    endDateField.value = dateString || new Date().toISOString().split("T")[0];
    deleteBtn.style.display = "none";
  }
  modal.style.display = "block";
}

export function closeModal() {
  modal.style.display = "none";
}

export function populateEventForm(event) {
  eventIdField.value = event.id;
  titleField.value = event.title;
  startDateField.value = event.startDate;
  endDateField.value = event.endDate;
  startTimeField.value = event.startTime || "";
  endTimeField.value = event.endTime || "";
  locationField.value = event.location || "";
  colorField.value = event.color || "#007bff";
  descriptionField.value = event.description || "";

  if (event.recurrence) {
    recurrenceRuleSelect.value = event.recurrence.rule || "none";
    if (event.recurrence.rule !== "none") {
      recurrenceUntilGroup.style.display = "block";
      recurrenceUntilField.value = event.recurrence.until || "";
    } else {
      recurrenceUntilGroup.style.display = "none";
    }
  } else {
    recurrenceRuleSelect.value = "none";
    recurrenceUntilGroup.style.display = "none";
  }
}
