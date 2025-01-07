import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // Alert state
  const [showFavorites, setShowFavorites] = useState(false); // State to toggle favorites visibility

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=2103f9ca&s=${searchTerm}`
      );
      setMovies(response.data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      showAlert("Something went wrong. Try again!", "error");
    }
    setIsLoading(false);
  };

  const addToFavorites = (movie) => {
    if (!favorites.find((fav) => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
      showAlert(`${movie.Title} added to Favorites!`, "success");
    } else {
      showAlert(`${movie.Title} is already in Favorites!`, "warning");
    }
  };

  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    showAlert(`${movie.Title} removed from Favorites!`, "info");
  };

  const showAlert = (message, type = "info") => {
    setAlertMessage({ text: message, type });
    setTimeout(() => setAlertMessage(null), 3000); // Hide alert after 3 seconds
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white relative">
      {/* Custom Alert */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            className={`fixed top-5 right-5 bg-opacity-90 px-6 py-3 rounded-lg shadow-lg ${
              alertMessage.type === "success"
                ? "bg-green-600 text-white"
                : alertMessage.type === "error"
                ? "bg-red-600 text-white"
                : "bg-yellow-500 text-black"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {alertMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="text-center py-10">
        <motion.h1
          className="text-6xl font-extrabold text-blue-500 neon-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          🎥 A.T. WORLD Movies
        </motion.h1>
        <p className="text-gray-400 mt-4">
          Search. Explore. Save your favorites in style.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 flex justify-center items-center gap-4"
        >
          <input
            type="text"
            className="p-4 rounded-lg bg-gray-800 text-white w-1/2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500 transition-all"
          >
            Search
          </button>
          {/* Favorites Button */}
          <button
            type="button"
            onClick={() => setShowFavorites(!showFavorites)}
            className="px-6 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 hover:shadow-purple-500 transition-all ml-4"
          >
            Favorites
          </button>
        </form>
      </header>

      {/* Main Section */}
      <main className="px-10">
        {isLoading ? (
          <p className="text-center text-gray-400 mt-10">Loading...</p>
        ) : movies.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.imdbID}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-blue-500 transition-all relative cursor-pointer"
                onClick={() => handleSearch}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.jpg"}
                  alt={movie.Title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-300">
                    {movie.Title}
                  </h3>
                  <p className="text-gray-400">{movie.Year}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(movie);
                    }}
                    className="mt-4 px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-700"
                  >
                    Add to Favorites
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No movies found. Try searching for something else.
          </p>
        )}
      </main>

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">
              Your Favorites
            </h2>
            {favorites.length > 0 ? (
              <div>
                {favorites.map((movie) => (
                  <div
                    key={movie.imdbID}
                    className="flex items-center justify-between py-2 border-b border-gray-600"
                  >
                    <span className="text-white">{movie.Title}</span>
                    <button
                      onClick={() => removeFromFavorites(movie)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No favorites yet!</p>
            )}
            <button
              onClick={() => setShowFavorites(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 mt-10 text-gray-500">
        Built with ❤️ by{" "}
        <span className="text-blue-400 font-bold">OrderOp</span> 🚀
      </footer>
    </div>
  );
}

export default App;
