import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSeries } from "../../service/redux/reducers/series/seriesSlice";
import "./series.css";
import { useNavigate } from "react-router-dom";
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
          </Modal.Footer>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const SeriesPage = () => {
  const dispatch = useDispatch();
  const series = useSelector((state) => state.series.series);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/series")
      .then((res) => {
        dispatch(setSeries(res.data.result));
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  const genres = ["Action", "Comedy", "Drama", "Horror", "SciFi"];

  return (
    <div className="series-container">
      <h1>Series Page</h1>
      {genres.map((genre) => (
        <section key={genre} className="genre-section">
          <h2>{genre}</h2>
          <div className="series-grid">
            {series.length > 0 ? (
              series
                .filter((show) => show.genre_name === genre)
                .map((show) => (
                  <div
                    className="flip-card"
                    key={show.id}
                    onClick={() => {
                      setSelectedMovie(show);
                      setModalShow(true);
                    }}
                  >
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <img
                          src={show.poster}
                          alt={show.title}
                          className="series-image"
                        />
                      </div>
                      <div className="flip-card-back">
                        <h2 className="series-title">{show.title}</h2>
                        <p className="series-description">{show.description}</p>
                        <p className="series-rating">⭐ {show.rate}/10</p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p>Loading...</p>
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

export default SeriesPage;
