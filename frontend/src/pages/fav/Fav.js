import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import {
  setMovieFav,
  setSeriesFav,
  addFav,
  removeFav,
} from "../../service/redux/reducers/fav/favSlice";

const MovieModal = ({ show, onHide, fav }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.fav);

  if (!fav) return null;

  const isFavorite =
    favorites.movieFav.some((favorite) => favorite.movie_id === fav.movie_id) ||
    favorites.seriesFav.some(
      (favorite) => favorite.series_id === fav.series_id
    );

  const handleToggleFav = () => {
    const favData = fav.movie_id
      ? { movie_id: fav.movie_id }
      : { series_id: fav.series_id };

    if (isFavorite) {
      axios
        .delete("http://localhost:5000/favorite/remove", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: favData,
        })

        .then(() => {
          dispatch(removeFav(fav.movie_id || fav.series_id));
          alert("Removed from favorites!");
        })
        .catch((err) => console.log("Error:", err));
    } else {
      axios
        .post("http://localhost:5000/favorite/add", favData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          dispatch(addFav(res.data.favorite));
          alert("Added to favorites!");
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
        <Modal.Title>{fav.movie_title || fav.series_title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex">
        <img
          src={fav.movie_poster || fav.series_poster}
          alt={fav.movie_title || fav.series_title}
          style={{ width: "40%", borderRadius: "10px" }}
        />
        <div className="modal-content-container">
          {(fav.movie_trailer || fav.series_trailer) &&
          (fav.movie_trailer.includes("youtube.com") ||
            fav.series_trailer.includes("youtube.com")) ? (
            <iframe
              width="100%"
              height="315"
              src={getYouTubeEmbedUrl(fav.movie_trailer || fav.series_trailer)}
              title={fav.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              src={fav.movie_trailer || fav.series_trailer}
              controls
              autoPlay
              style={{ width: "100%" }}
            ></video>
          )}

          {console.log("fav", fav)}
          <div>
            <h4>{fav.movie_title || fav.series_title}</h4>
            <h4>{fav.movie_rate || "N/A"}</h4>
            <p>{fav.movie_description || fav.series_description}</p>
          </div>
          <Modal.Footer>
            <Button variant="primary" onClick={handleToggleFav}>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
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

const Fav = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.fav);
  const [selectedFav, setSelectedFav] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const userId = useSelector((state) => state.authReducer.userId);

  useEffect(() => {
    if (userId) {
      axios
        .get("http://localhost:5000/favorite/movies", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          console.log("response.data.result", response.data.result);

          dispatch(setMovieFav(response.data.result));
        })
        .catch((error) => console.error("Error fetching favorites:", error));
    }

    axios
      .get("http://localhost:5000/favorite/series", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        dispatch(setSeriesFav(response.data.result));
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [dispatch, userId]);

  return (
    <div>
      <h2>Your Favorites</h2>
      <div className="movies-container">
        <div className="movies-grid">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div
                className="flip-card"
                key={fav.id}
                onClick={() => {
                  setSelectedFav(fav);
                  setModalShow(true);
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img
                      src={fav.movie_poster || fav.series_poster}
                      alt={fav.movie_title || fav.series_title}
                      className="movie-image"
                    />
                  </div>
                  <div className="flip-card-back">
                    <h2>{fav.movie_title || fav.series_title}</h2>
                    <p>{fav.movie_description || fav.series_description}</p>
                    <button className="more-button">More</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading favorites...</p>
          )}
        </div>
      </div>
      <MovieModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        fav={selectedFav}
      />
    </div>
  );
};

export default Fav;
