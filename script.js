document.addEventListener("DOMContentLoaded", () => {
    const titleInput = document.getElementById("titleInput");
    const textInput = document.getElementById("textInput");
    const createButton = document.getElementById("createButton");
    const notesContainer = document.getElementById("notesContainer");
    const notesContainerFavorite = document.getElementById("notesContainerFavorites");
    const modal = document.getElementById("modal");
    const modalYesButton = document.getElementById("modalYesButton");
    const modalNoButton = document.getElementById("modalNoButton");
    const colorOptions = document.querySelectorAll(".color-option");
    const searchInput = document.getElementById("search-input");
    let deleteIndex = null;
    let activeTab = "home";
    let tabLinks = document.querySelectorAll(".tab-link");

    titleInput.addEventListener("input", removeErrorClass);
    textInput.addEventListener("input", removeErrorClass);
    createButton.addEventListener("click", createNote);
    modalYesButton.addEventListener("click", deleteConfirmed);
    modalNoButton.addEventListener("click", deleteCanceled);
    setEventListenersForColorEl();
    searchInput.addEventListener("input", getNotes);

    getNotes();

    tabLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("activeEditIndex");

            // Отображение активного таба
            activeTab = this.dataset.tab;
            showTab(activeTab);

            getNotes();
        });
    });

    // Функция для отображения заметок
    function getNotes() {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        switch (activeTab) {
            case "home":
                displayNotes(notes);
                break;
            case "favorites":
                let favoriteNotes = notes.filter((note) => note.favorite);
                displayFavoriteNotes(favoriteNotes);
                break;
            default:
                displayNotes(notesContainer, notes);
                break;
        }
    }

    function displayNotes(notes) {
        const searchTerm = searchInput.value.toLowerCase();

        notesContainer.innerHTML = "";

        if (notes.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No available notes.";
            notesContainer.appendChild(emptyMessage);
            return;
        }

        notes.forEach(function (note, index) {
            if (note.title.toLowerCase().includes(searchTerm) || searchTerm === "") {
                const noteElement = createNoteElement(note, index);
                notesContainer.appendChild(noteElement);
            }
        });
    }

    function displayFavoriteNotes(notes) {
        const searchTerm = searchInput.value.toLowerCase();

        notesContainerFavorite.innerHTML = "";

        if (notes.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No favorite notes.";
            notesContainerFavorite.appendChild(emptyMessage);
            return;
        }

        notes.forEach(function (note, index) {
            if (note.title.toLowerCase().includes(searchTerm) || searchTerm === "") {
                const noteElement = createNoteElement(note, index);
                notesContainerFavorite.appendChild(noteElement);
            }
        });
    }

    function showTab(tabId) {
        let tabContents = document.querySelectorAll(".tab-content");
        let tabLinks = document.querySelectorAll(".tab-link");

        tabContents.forEach(function (content) {
            content.style.display = "none";
        });

        tabLinks.forEach(function (link) {
            link.classList.remove("active");
        });

        document.getElementById(tabId).style.display = "block";

        // Добавление класса "active" к выбранной ссылке навигации
        let activeLink = document.querySelector('.tab-link[data-tab="' + tabId + '"]');
        activeLink.classList.add("active");
    }

    // Функция для обновления состояния избранного для заметки
    function toggleFavoriteStatus(id, index) {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.forEach((note) => {
            if (note.id === id) {
                note.favorite = !note.favorite;
            }
        });

        // Сохраняем обновленные заметки в localStorage
        localStorage.setItem("notes", JSON.stringify(notes));

        const noteElement = document.getElementById(`note_${index}`);
        const favoriteButton = noteElement.querySelector(".favorite-button");
        if (favoriteButton) {
            favoriteButton.textContent = notes.find((note) => note.id === id).favorite
                ? "Remove from favorites"
                : "Add to favorites";
        }

        if (activeTab === "favorites") {
            getNotes();
        }
    }

    function generateUniqueId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    function setEventListenersForColorEl() {
        colorOptions.forEach((option) => {
            option.addEventListener("click", () => {
                colorOptions.forEach((opt) => {
                    opt.classList.remove("selected");
                });

                option.classList.add("selected");
            });
        });
    }

    function deleteNoteConfirmation(index) {
        deleteIndex = index;
        modal.style.display = "block";
    }

    function deleteConfirmed() {
        deleteNote(deleteIndex);
        modal.style.display = "none";
    }

    function deleteCanceled() {
        modal.style.display = "none";
    }

    function removeErrorClass() {
        this.classList.remove("error");
    }

    function validInputs() {
        const isTitleValid = validateInput(titleInput, 5, 15);
        const isTextValid = validateInput(textInput, 5, 100);
        return isTitleValid && isTextValid;
    }

    function validateInput(input, minLength, maxLength) {
        const value = input.value.trim();
        const isValid = value.length >= minLength && value.length <= maxLength;
        input.classList.toggle("error", !isValid);
        return isValid;
    }

    function saveNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function createNote() {
        if (!validInputs()) {
            return;
        }

        const selectedColor = document.querySelector('input[name="color"]:checked').value || "FCF6BD";

        const note = {
            title: titleInput.value,
            text: textInput.value,
            created: formatDateTime(new Date()),
            updated: false,
            color: selectedColor,
            favorite: false,
            id: generateUniqueId(),
        };

        saveNoteToLocalStorage(note);

        titleInput.value = "";
        textInput.value = "";
        searchInput.value = "";

        getNotes();
    }

    function deleteNote(index) {
        // cancel editing note if exists
        localStorage.removeItem("activeEditIndex");

        // delete note by index and update list
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));

        getNotes();
    }

    function updateNote(index) {
        const activeEditIndex = parseInt(localStorage.getItem("activeEditIndex"));

        if (!isNaN(activeEditIndex) && activeEditIndex !== index) {
            cancelUpdate(activeEditIndex);
        }

        const noteElement = document.getElementById(`note_${index}`);
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const note = notes[index];

        noteElement.innerHTML = "";

        const editTitleInput = createInputElement("text", `editTitleInput_${index}`, note.title);
        noteElement.appendChild(editTitleInput);

        noteElement.appendChild(document.createElement("br"));

        const editTextInput = createInputElement("textarea", `editTextInput_${index}`, note.text);
        noteElement.appendChild(editTextInput);

        noteElement.appendChild(document.createElement("br"));

        const saveButton = createButtonElement("Save");
        saveButton.addEventListener("click", () => saveUpdate(index));
        noteElement.appendChild(saveButton);

        const cancelButton = createButtonElement("Cancel");
        cancelButton.addEventListener("click", () => cancelUpdate(index));
        noteElement.appendChild(cancelButton);

        localStorage.setItem("activeEditIndex", index.toString());
    }

    function createInputElement(type, id, value) {
        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.value = value;
        input.classList.add("note-input");
        return input;
    }

    function createButtonElement(text) {
        const button = document.createElement("button");
        button.textContent = text;
        return button;
    }

    function saveUpdate(index) {
        const editTitleInput = document.getElementById(`editTitleInput_${index}`);
        const editTextInput = document.getElementById(`editTextInput_${index}`);

        if (!validateInput(editTitleInput, 5, 15) || !validateInput(editTextInput, 5, 100)) {
            return;
        }

        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const note = notes[index];

        note.title = editTitleInput.value;
        note.text = editTextInput.value;
        note.updated = true;
        note.created = formatDateTime(new Date());

        localStorage.setItem("notes", JSON.stringify(notes));
        getNotes();
    }

    function cancelUpdate(index) {
        const noteElement = document.getElementById(`note_${index}`);
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const note = notes[index];

        if (noteElement) {
            noteElement.innerHTML = "";
        }

        const noteTitle = document.createElement("strong");
        noteTitle.textContent = note.title;
        noteElement.appendChild(noteTitle);

        const noteText = document.createElement("p");
        noteText.textContent = note.text;
        noteElement.appendChild(noteText);

        if (note.updated) {
            const updatedText = document.createElement("p");
            updatedText.textContent = `Updated ${note.created}`;
            noteElement.appendChild(updatedText);
        } else {
            const createdText = document.createElement("p");
            createdText.textContent = note.created;
            noteElement.appendChild(createdText);
        }

        const editButton = createButtonElement("Edit");
        editButton.addEventListener("click", () => updateNote(index));
        noteElement.appendChild(editButton);

        const deleteButton = createButtonElement("Delete");
        deleteButton.addEventListener("click", () => deleteNoteConfirmation(index));
        noteElement.appendChild(deleteButton);

        const favoriteBtn = note.favorite
            ? createButtonElement("Remove from favorites")
            : createButtonElement("Add to favorites");
        favoriteBtn.classList.add("favorite-button");
        noteElement.appendChild(favoriteBtn);

        localStorage.removeItem("activeEditIndex");
    }

    function createNoteElement(note, index) {
        const noteElement = document.createElement("div");
        noteElement.id = `note_${index}`;
        noteElement.style.backgroundColor = note.color || "FCF6BD";

        const noteTitle = document.createElement("strong");
        noteTitle.textContent = note.title;
        noteElement.appendChild(noteTitle);

        const noteText = document.createElement("p");
        noteText.textContent = note.text;
        noteElement.appendChild(noteText);

        if (note.updated) {
            const updatedText = document.createElement("p");
            updatedText.textContent = `Updated ${note.created}`;
            noteElement.appendChild(updatedText);
        } else {
            const createdText = document.createElement("p");
            createdText.textContent = note.created;
            noteElement.appendChild(createdText);
        }

        const editButton = createButtonElement("Edit");
        editButton.addEventListener("click", () => updateNote(index));
        noteElement.appendChild(editButton);

        const deleteButton = createButtonElement("Delete");
        deleteButton.addEventListener("click", () => deleteNoteConfirmation(index));
        noteElement.appendChild(deleteButton);

        const favoriteBtn = note.favorite
            ? createButtonElement("Remove from favorites")
            : createButtonElement("Add to favorites");
        favoriteBtn.classList.add("favorite-button");
        noteElement.appendChild(favoriteBtn);

        favoriteBtn.addEventListener("click", () => {
            toggleFavoriteStatus(note.id, index); // Используется идентификатор заметки
        });

        return noteElement;
    }

    function formatDateTime(date) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}.${month}.${year}`;
    }
});
