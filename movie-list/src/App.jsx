import "./App.css";
import Search from "./components/Search.jsx";
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const fetchMovie = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movie");
      }

      const data = await response.json();

      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch movie");
        setMovies([]);
        return;
      }
      console.log(data);
      setMovies(data.results || []);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to get the movies data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img
            src='./hero.png'
            alt='movie poster'
          />
          <h1>
            <span className='text-gradient'>Find Movies</span> you'll enjoy
            without the hassle
          </h1>

          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </header>

        <section className='all-movies'>
          <h2>All Movies</h2>

          {isLoading ? (
            <p className='text-white'>Loading</p>
          ) : errorMessage ? (
            <p className='text-red-500'> {errorMessage} </p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
