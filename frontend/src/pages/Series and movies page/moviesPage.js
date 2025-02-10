import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setMovies } from "../../service/redux/reducers/movies/movieSlice";
import { Modal, Button } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import "./movies.css";

const MovieModal = ({ show, onHide, movie }) => {
  if (!movie) return null;
  // console.log(movie);
  console.log(movie.trailer);

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
          <video
            src="https://www.youtube.com/watch?v=uYPbbksJxIg"
            controls
            autoPlay
            style={{ width: "100%" }}
          ></video>
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
          </Modal.Footer>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const MoviesPage = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movie")
      .then((res) => {
        dispatch(setMovies(res.data.result));
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"];

  return (
    <div className="movies-container">
      {genres.map((genre) => (
        <section key={genre} className="genre-section">
          <h2 className="genre-title">{genre}</h2>
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies
                .filter((movie) => movie.genre_name === genre)
                .map((movie) => (
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
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-description">{movie.description}</p>
                        <p className="movie-rating">⭐ {movie.rate}/10</p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="loading-text">Fetching movies...</p>
            )}
          </div>
        </section>
      ))}
      <MovieModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        movie={selectedMovie}
      />
    </div>
  );
};

export default MoviesPage;
