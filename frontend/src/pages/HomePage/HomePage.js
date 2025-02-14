import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import "./slider.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setMovies } from "../../service/redux/reducers/movies/movieSlice";
import { setSeries } from "../../service/redux/reducers/series/seriesSlice";
import {
  addLike,
  removeLike,
} from "../../service/redux/reducers/like/likeSlice";
import { Modal, Button, Alert } from "react-bootstrap";
import {
  addFav,
  setFav,
  removeFav,
} from "../../service/redux/reducers/fav/favSlice";
const MovieModal = ({ show, onHide, movie, series }) => {
  console.log("series", series);

  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.fav);
  const likes = useSelector((state) => state.fav);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("");

  if (!movie) return null;

  console.log("movie.id", movie.id);

  const isFavorite = favorites.some(
    (fav) => fav.movie_id === movie.id || fav.series_id === movie.id
  );

  const isLiked = likes.some(
    (like) => like.movie_id === movie.id || like.series_id === movie.id
  );

  const handleToggleFav = () => {
    const favData = movie.id
      ? { movie_id: movie.id }
      : { series_id: series.id };

    if (isFavorite) {
      axios
        .delete(
          `http://localhost:5000/favorite/remove/${movie.id || series.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: favData,
          }
        )
        .then(() => {
          dispatch(removeFav(movie.id || series.id));
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
          console.log("res.data.favorite", res.data.favorite);

          dispatch(addFav(res.data.favorite));
          setAlertMessage("Added to favorites!");
          setAlertVariant("success");
        })
        .catch((err) => console.log("Error:", err));
    }
  };
  const handleToggleLike = () => {
    const likeData = movie.id
      ? { movie_id: movie.id }
      : { series_id: movie.id };

    if (isLiked) {
      axios
        .post(`http://localhost:5000/like/unlike`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: likeData,
        })
        .then(() => {
          dispatch(removeLike(movie.id));
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      axios
        .post(`http://localhost:5000/like/addlike`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: likeData,
        })
        .then((res) => {
          dispatch(addLike(res.data.like));
          console.log("res", res);
        })
        .catch((err) => console.log("err", err));
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
          <div>
            <h4 className="modal-movie-title">{movie.title}</h4>
            <h4 className="modal-movie-description">{movie.genre_name}</h4>
            <h4 className="modal-movie-description">{movie.rate}</h4>
            <h4 className="modal-movie-description">{movie.writer_name}</h4>
            <p className="modal-movie-description">{movie.description}</p>
          </div>
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
            </Button>
            <button onClick={handleToggleLike}>
              {isLiked ? "Unlike" : "like"}
            </button>
          </Modal.Footer>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);
  const series = useSelector((state) => state.series.series);
  const favorites = useSelector((state) => state.fav);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movie")
      .then((res) => {
        dispatch(setMovies(res.data.result));
      })
      .catch((err) => console.error(err));
  }, [dispatch, favorites]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/series")
      .then((res) => {
        dispatch(setSeries(res.data.result));
      })
      .catch((err) => console.error(err));
  }, [dispatch, favorites]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <div className="homepage-container">
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {movies.length > 0 ? (
            movies.slice(0, 5).map((movie) => (
              <Carousel.Item key={movie.id}>
                <div className="carousel-item-container">
                  <div className="backgroundd-container">
                    <img
                      className=" backgroundd-img"
                      src={movie.poster || series.poster}
                      alt={movie.title || series.title}
                    />
                  </div>

                  <div className="carousel-content">
                    <div className="poster-left">
                      <img
                        className="Slider-img small-poster-img"
                        src={movie.poster || series.poster}
                        alt={movie.title}
                      />
                    </div>
                    <div className="movie-info">
                      <div className="carousel-description">
                        <p className="description-text"></p>
                        <h3>{movie.title}</h3>
                        <p className="movie-description">{movie.description}</p>
                        <p className="movie-actors">{movie.actor_names}</p>
                        <p className="movie-director">{movie.director_name}</p>
                        <a href="/watch-now" className="watch-now-link">
                          Watch Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <div className="flexSlider">
                <p>Loading...</p>
              </div>
            </Carousel.Item>
          )}
        </Carousel>

        <div>
          <div className="movies-container">
            <h2>Movies By Nolan</h2>
            <div className="movies-grid">
              {movies.length > 0 ? (
                movies.map((movie) =>
                  movie.section === "Nolan" ? (
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
                        {console.log(movie)}

                        <div className="flip-card-back">
                          <h2 className="movie-title">{movie.title}</h2>
                          <p className="movie-description">
                            {movie.description}
                          </p>
                          <p className="movie-actors">{movie.actor_names}</p>
                          <p className="movie-director">
                            {movie.director_name}
                          </p>

                          <p className="movie-rating">⭐ {movie.rate}/10</p>
                        </div>
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          <div className="series-container">
            <h2>Latest Episodes</h2>
            <div className="movies-grid">
              {series.length > 0 ? (
                series.map((serie) =>
                  serie.section === "Pouplar" ? (
                    <div
                      className="flip-card"
                      key={serie.id}
                      onClick={() => {
                        setSelectedMovie(serie);
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
                        {console.log("serie", serie)}

                        <div className="flip-card-back">
                          <h2 className="movie-title">{serie.title}</h2>
                          <p className="movie-description">
                            {serie.description}
                          </p>
                          <p className="movie-actors">{serie.actor_names}</p>
                          <p className="movie-director">
                            {serie.director_name}
                          </p>
                          <p className="movie-rating">⭐ {serie.rate}/10</p>
                        </div>
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="movies-container">
            <h2>Top 10 in Jordan</h2>
            <div className="movies-grid">
              {movies.length > 0 ? (
                movies.map((movie) =>
                  movie.section === "Jordan" ? (
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
                        {console.log(movie)}

                        <div className="flip-card-back">
                          <h2 className="movie-title">{movie.title}</h2>
                          <p className="movie-description">
                            {movie.description}
                          </p>
                          <p className="movie-actors">{movie.actor_names}</p>
                          <p className="movie-director">
                            {movie.director_name}
                          </p>
                          <p className="movie-rating">⭐ {movie.rate}/10</p>
                        </div>
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          <div className="movies-container">
            <h2>Coming Soon</h2>
            <div className="movies-grid">
              {movies.length > 0 ? (
                movies.map((movie) =>
                  movie.section === "Soon" ? (
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
                        {console.log(movie)}

                        <div className="flip-card-back">
                          <h2 className="movie-title">{movie.title}</h2>
                          <p className="movie-description">
                            {movie.description}
                          </p>
                          <p className="movie-actors">{movie.actor_names}</p>
                          <p className="movie-director">
                            {movie.director_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>

        <MovieModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          movie={selectedMovie}
        />
      </div>
    </>
  );
};

export default HomePage;
