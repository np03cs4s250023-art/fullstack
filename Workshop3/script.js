const API_URL = "http://localhost:3000/movies";

const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const form = document.getElementById("add-movie-form");

let allMovies = [];

/* ----------------- RENDER MOVIES ----------------- */
function renderMovies(moviesToDisplay) {
  movieListDiv.innerHTML = "";

  if (!moviesToDisplay || moviesToDisplay.length === 0) {
    movieListDiv.innerHTML = "<p>No movies found matching your criteria.</p>";
    return;
  }

  moviesToDisplay.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-item");

    movieElement.innerHTML = `
      <p class="movie-info">
        <strong>${movie.title}</strong> (${movie.year}) 
        - ${movie.genre || "Unknown"}
      </p>
      <div class="movie-actions">
        <button class="edit-btn" data-id="${movie.id}">Edit</button>
        <button class="delete-btn" data-id="${movie.id}">Delete</button>
      </div>
    `;

    movieListDiv.appendChild(movieElement);
  });

  attachActionButtons();
}

/* ----------------- BUTTON ACTIONS ----------------- */
function attachActionButtons() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const movie = allMovies.find((m) => m.id == id);
      editMoviePrompt(movie);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      deleteMovie(id);
    });
  });
}

/* ----------------- FETCH MOVIES ----------------- */
function fetchMovies() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((movies) => {
      allMovies = movies;
      renderMovies(allMovies);
    })
    .catch((err) => console.error("Error fetching movies:", err));
}

fetchMovies();

/* ----------------- SEARCH ----------------- */
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredMovies = allMovies.filter((movie) => {
    const title = movie.title?.toLowerCase() || "";
    const genre = movie.genre?.toLowerCase() || "";
    return title.includes(searchTerm) || genre.includes(searchTerm);
  });

  renderMovies(filteredMovies);
});

/* ----------------- ADD MOVIE ----------------- */
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const newMovie = {
    title: document.getElementById("title").value,
    genre: document.getElementById("genre").value || "Unknown",
    year: parseInt(document.getElementById("year").value),
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMovie),
  })
    .then((res) => res.json())
    .then(() => {
      form.reset();
      fetchMovies();
    })
    .catch((err) => console.error("Error adding movie:", err));
});

/* ----------------- EDIT MOVIE ----------------- */
function editMoviePrompt(movie) {
  const newTitle = prompt("Enter new Title:", movie.title);
  const newYear = prompt("Enter new Year:", movie.year);
  const newGenre = prompt("Enter new Genre:", movie.genre);

  // If user cancels
  if (!newTitle || !newYear || !newGenre) return;

  const updatedMovie = {
    title: newTitle,
    year: parseInt(newYear),
    genre: newGenre,
  };

  updateMovie(movie.id, updatedMovie);
}

function updateMovie(movieId, updatedMovieData) {
  fetch(`${API_URL}/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedMovieData),
  })
    .then((res) => res.json())
    .then(() => fetchMovies())
    .catch((err) => console.error("Error updating movie:", err));
}

/* ----------------- DELETE MOVIE ----------------- */
function deleteMovie(movieId) {
  fetch(`${API_URL}/${movieId}`, {
    method: "DELETE",
  })
    .then(() => fetchMovies())
    .catch((err) => console.error("Error deleting movie:", err));
}
