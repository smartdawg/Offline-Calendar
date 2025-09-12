import { handleEditEvent } from "./index.js";

const modal = document.getElementById("search-modal");
const closeModalBtn = document.getElementById("close-search-modal");
const resultsList = document.getElementById("search-results-list");

// --- EVENT LISTENERS ---
closeModalBtn.onclick = () => closeModal();
window.onclick = (event) => {
  if (event.target == modal) {
    closeModal();
  }
};

// --- FUNCTIONS ---
export function openModal() {
  modal.style.display = "block";
}

export function closeModal() {
  modal.style.display = "none";
}

// The 'export' keyword was missing from this function declaration.
export function renderSearchResults(results) {
  resultsList.innerHTML = "";
  if (results.length === 0) {
    resultsList.innerHTML = "<li>No events found.</li>";
    return;
  }

  results.forEach((event) => {
    const li = document.createElement("li");
    li.dataset.eventId = event.id;

    const title = document.createElement("div");
    title.className = "search-result-title";
    title.textContent = event.title;

    const details = document.createElement("div");
    details.className = "search-result-details";

    // Ensure date is valid before trying to format it
    const startDate = new Date(event.startDate + "T00:00:00"); // Mitigate timezone issues
    const dateString = !isNaN(startDate)
      ? startDate.toDateString()
      : "Invalid date";

    details.textContent = `${dateString} - ${event.location || "No location"}`;

    li.appendChild(title);
    li.appendChild(details);

    li.addEventListener("click", () => {
      handleEditEvent(event.id);
      closeModal();
    });

    resultsList.appendChild(li);
  });
}
