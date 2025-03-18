// Select elements
const noteInput = document.getElementById("note-input");
const saveButton = document.getElementById("save-note");
const notesList = document.getElementById("notes-list");
const darkModeToggle = document.getElementById("toggle-dark-mode");
const searchInput = document.getElementById("search-input");
const exportButton = document.getElementById("export-notes");

// Load notes from Local Storage on page load
document.addEventListener("DOMContentLoaded", loadNotes);

// Save note to Local Storage
saveButton.addEventListener("click", function () {
  let noteText = noteInput.value.trim();

  if (noteText !== "") {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Create note object with timestamp
    let newNote = {
      text: noteText,
      timestamp: new Date().toISOString(), // Store current time in ISO format
    };

    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes)); // Save as JSON

    displayNotes();
    noteInput.value = ""; // Clear textarea
  }
});

// Load and display notes from Local Storage
function loadNotes() {
  displayNotes();
}

// Display updated notes (sorted)
function displayNotes() {
  notesList.innerHTML = "";
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  // Sort notes by timestamp (newest first)
  notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  notes.forEach(addNoteToList);
}

// Add note to UI
function addNoteToList(note) {
  let li = document.createElement("li");
  li.innerHTML = `<strong>${note.text}</strong> <br> 
                    <small>${formatDate(note.timestamp)}</small>`;

  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";
  deleteButton.addEventListener("click", function () {
    deleteNote(note.text);
  });

  li.appendChild(deleteButton);
  notesList.appendChild(li);
}

// Delete note
function deleteNote(noteText) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter((note) => note.text !== noteText);
  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

// Format timestamp for display
function formatDate(timestamp) {
  let date = new Date(timestamp);
  return date.toLocaleString(); // Convert to readable format
}

// Dark mode toggle
darkModeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});

// Search functionality
searchInput.addEventListener("input", function () {
  let searchTerm = searchInput.value.toLowerCase();
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  let filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );

  notesList.innerHTML = ""; // Clear current list
  filteredNotes.forEach(addNoteToList);
});

// Export notes as JSON file
exportButton.addEventListener("click", function () {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let jsonStr = JSON.stringify(notes, null, 2);
  let blob = new Blob([jsonStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
