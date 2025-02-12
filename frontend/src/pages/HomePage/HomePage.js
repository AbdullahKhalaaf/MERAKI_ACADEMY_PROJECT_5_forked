import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import "./slider.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setMovies } from "../../service/redux/reducers/movies/movieSlice";
import { setSeries } from "../../service/redux/reducers/series/seriesSlice";
import { Modal, Button } from "react-bootstrap";

const MovieModal = ({ show, onHide, movie }) => {
  if (!movie) return null;

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
            <span></span>
            <Button variant="danger">Add to Favorites ❤️ </Button>
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

  useEffect(() => {
    axios
      .get("http://localhost:5000/series")
      .then((res) => {
        dispatch(setSeries(res.data.result));
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

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
