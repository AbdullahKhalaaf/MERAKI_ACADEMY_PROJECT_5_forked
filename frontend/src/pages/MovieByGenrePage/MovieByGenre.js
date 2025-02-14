import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMoviesByGenreId } from "../../service/redux/reducers/movies/movieSlice";
import { setSeriesByGenreId } from "../../service/redux/reducers/series/seriesSlice";
import { Modal, Button, Alert } from "react-bootstrap";
import axios from "axios";
import {
  setFav,
  removeFav,
  addFav,
} from "../../service/redux/reducers/fav/favSlice";

const MovieModal = ({ show, onHide, movie, serie }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.fav);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("");
  console.log(serie);

  if (!movie) return null;
  const isFavorite = favorites.some(
    (fav) => fav.movie_id === movie.id || fav.series_id === serie.id
  );

  const handleToggleFav = () => {
    const favData =
      movie.id || serie.id ? { movie_id: movie.id } : { series_id: serie.id };

    if (isFavorite) {
      axios
        .delete(
          `http://localhost:5000/favorite/remove/${movie.id || serie.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: favData,
          }
        )
        .then(() => {
          dispatch(removeFav(movie.id || serie.id));
          setAlertMessage("Removed from favorites!");
          setAlertVariant("danger");
        })
        .catch((err) => console.log("Error:", err));
    } else {
      axios
        .post("http://localhost:5000/favorite/add", favData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          dispatch(addFav(res.data.favorite));
          setAlertMessage("Added to favorites!");
          setAlertVariant("success");
        })
        .catch((err) => console.log("Error:", err));
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">{movie.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <img
          src={movie.poster}
          alt={movie.title}
          style={{ width: "40%", borderRadius: "10px" }}
        />
        <div className="modal-content-container">
          {alertMessage && (
            <Alert
              variant={alertVariant}
              onClose={() => setAlertMessage(null)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}
          {movie.trailer && movie.trailer.includes("youtube.com") ? (
            <iframe
              width="100%"
              height="315"
              src={getYouTubeEmbedUrl(movie.trailer)}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              src={movie.trailer}
              controls
              autoPlay
              style={{ width: "100%" }}
            ></video>
          )}
          <h4 className="modal-movie-title">{movie.title}</h4>
          <h4 className="modal-movie-description">{movie.genre_name}</h4>
          <h4 className="modal-movie-description">{movie.rate}</h4>
          <h4 className="modal-movie-description">{movie.writer_name}</h4>
          <p className="modal-movie-description">{movie.description}</p>
          <Modal.Footer>
            {movie.trailer && (
              <Button
                variant="danger"
                as="a"
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Trailer
              </Button>
            )}
            <Button variant="primary" onClick={handleToggleFav}>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              {console.log(isFavorite)}
            </Button>
          </Modal.Footer>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

function MovieByGenre() {
  const { genreType, genreId } = useParams();
  console.log("genretype", genreType);

  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);
  const series = useSelector((state) => state.series.series);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (!genreId) return;

    axios
      .get(`http://localhost:5000/movie/genre/${genreId}`)
      .then((res) => {
        dispatch(setMoviesByGenreId(res.data.result));
      })
      .catch((err) => console.error("Error fetching movies:", err));

    axios
      .get(`http://localhost:5000/series/genre/${genreId}`)
      .then((res) => {
        dispatch(setSeriesByGenreId(res.data.result));
      })
      .catch((err) => console.error("Error fetching series:", err));
  }, [dispatch, genreId]);

  return (
    <div>
      <div className="movies-container">
        <h2>{genreType} Movies</h2>
        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                className="flip-card"
                key={movie.id}
                onClick={() => {
                  setSelectedMovie(movie);
                  setModalShow(true);
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="movie-image"
                    />
                  </div>

                  <div className="flip-card-back">
                    <h2 className="movie-title">{movie.title}</h2>
                    <p className="movie-description">{movie.description}</p>
                    <p className="movie-actors">{movie.actor_names}</p>
                    <p className="movie-director">{movie.director_name}</p>
                    <p className="movie-rating">⭐ {movie.rate}/10</p>
                    <button className="more-button">More</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading movies...</p>
          )}
        </div>
        <MovieModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          movie={selectedMovie}
        />
      </div>

      <div className="series-container">
        <h2>{genreType} Series</h2>
        <div className="movies-grid">
          {series.length > 0 ? (
            series.map((serie) => (
              <div
                className="flip-card"
                key={serie.id}
                onClick={() => {
                  setSelectedSeries(serie);
                  setModalShow(true);
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img
                      src={serie.poster}
                      alt={serie.title}
                      className="movie-image"
                    />
                  </div>

                  <div className="flip-card-back">
                    <h2 className="movie-title">{serie.title}</h2>
                    <p className="movie-description">{serie.description}</p>
                    <p className="movie-actors">{serie.actor_names}</p>
                    <p className="movie-director">{serie.director_name}</p>
                    <p className="movie-rating">⭐ {serie.rate}/10</p>
                    <button className="more-button">More</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading series...</p>
          )}
        </div>
      </div>
      <MovieModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        movie={selectedMovie}
      />
    </div>
  );
}

export default MovieByGenre;
