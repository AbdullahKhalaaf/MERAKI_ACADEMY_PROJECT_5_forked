import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MovieIcon from "@mui/icons-material/Movie";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Paper } from "@mui/material";
import "./navBar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGenre } from "../../service/redux/reducers/genre/genreSlice";
import { useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import {
  setFav,
  removeFav,
  addFav,
} from "../../service/redux/reducers/fav/favSlice";

const MovieModal = ({ show, onHide, movie }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.fav);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("");
  const nav = useNavigate();
  if (!movie) return null;
  const isFavorite = favorites.some(
    (fav) => fav.movie_id === movie.id || fav.series_id === movie.series_id
  );

  const handleToggleFav = () => {
    const favData = movie.id ? { movie_id: movie.id } : { series_id: movie.id };

    if (isFavorite) {
      axios
        .delete(`http://localhost:5000/favorite/remove/${movie.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: favData,
        })
        .then(() => {
          dispatch(removeFav(movie.id || movie.series_id));
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
                style={{
                  backgroundColor: "#ff4444",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={() => nav("/FullScreen", { state: { movie } })}
              >
                Watch now
              </Button>
            )}
            <Button
              style={{
                backgroundColor: "#ff4444",
                fontWeight: "bold",
                color: "white",
              }}
              variant="primary"
              onClick={handleToggleFav}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </Modal.Footer>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

const pages = ["Home", "Movies", "Series", "Genre", "Favorites"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElGenre, setAnchorElGenre] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genre.genre);
  const movies = useSelector((state) => state.movies.movies);
  const series = useSelector((state) => state.series.series);
  const userId = localStorage.getItem("userId");

  const [searchResultMovie, setsearchResultMovie] = useState([]);
  const [searchResultSeries, setsearchResultSeries] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const state = useSelector((reducer) => {
    return {
      authReducer: reducer.authReducer,
    };
  });
  // access the token and userId and isLoggedIn
  // const token = state.authReducer.token;
  // const userId = state.authReducer.userId;
  const isLoggedIn = state.authReducer.isLoggedIn;
  const [setSearch, setsetSearch] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:5000/movie/genre")
      .then((res) => {
        console.log("Genres API Response:", res.data.result);

        dispatch(setGenre(res.data.result));
        console.log("osama", movies);
      })
      .catch((error) => console.error("Error fetching genres", error));
  }, [dispatch]);

  // const handleSearch =(e) =>{

  // }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenGenreMenu = (event) => {
    setAnchorElGenre(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseGenreMenu = () => {
    setAnchorElGenre(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(to right, red, black)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MovieIcon sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 4,
              display: "flex",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              whiteSpace: "nowrap",
              maxWidth: "fit-content",
              overflow: "visible",
            }}
          >
            NEXTPLAY
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) =>
                page === "Genre" ? (
                  <MenuItem key={page} onClick={handleOpenGenreMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={page}
                    // onClick={() => nav(/${page.toLowerCase()})}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                )
              )}
              <Menu
                anchorEl={anchorElGenre}
                open={Boolean(anchorElGenre)}
                onClose={handleCloseGenreMenu}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                {genres.map((genre) => (
                  <MenuItem
                    key={genre.id}
                    onClick={() => {
                      nav(
                        `/genre/${genre.genre_type.toLowerCase()}/${genre.id}`
                      );
                      handleCloseGenreMenu();
                    }}
                    sx={{ "&:hover": { backgroundColor: "red" } }}
                  >
                    {/* git */}
                    {console.log(genre.genre_type)}
                    {genre.genre_type}
                  </MenuItem>
                ))}
              </Menu>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) =>
              page === "Genre" ? (
                <Button
                  key={page}
                  onClick={handleOpenGenreMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    width: "150px",
                  }}
                >
                  {page}
                </Button>
              ) : (
                <Button
                  key={page}
                  onClick={() => {
                    if (page === "Home") {
                      nav("/Main");
                    } else {
                      nav(`/${page.toLowerCase()}`);
                    }
                  }}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    width: "150px",
                  }}
                >
                  {page}
                </Button>
              )
            )}
          </Box>

          <div style={{ position: "relative", width: "250px" }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
              onChange={(e) => {
                const searchValue = e.target.value.toLowerCase();
                const filteredMovies = movies.filter((movie) =>
                  movie.title.toLowerCase().includes(searchValue)
                );
                const filteredSeries = series.filter((serie) =>
                  serie.title.toLowerCase().includes(searchValue)
                );
                console.log(
                  "aaaaaaaaaa",
                  filteredMovies,
                  "search value ",
                  movies
                );

                setsearchResultMovie(filteredMovies);
                setsearchResultSeries(filteredSeries);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {(searchResultMovie.length > 0 ||
              searchResultSeries.length > 0) && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  mt: 1,
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  zIndex: 10,
                  backgroundColor: "white",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <List>
                  {searchResultMovie.map((movie) => (
                    <ListItem
                      key={movie.id}
                      button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setModalShow(true);
                        setsearchResultMovie("");
                        setsearchResultSeries("");
                      }}
                    >
                      <ListItemText primary={movie.title} />
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{
                          width: "50px",
                          height: "75px",
                          borderRadius: "8px",
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                        }}
                      />
                    </ListItem>
                  ))}
                  {searchResultSeries.map((serie) => (
                    <ListItem
                      key={serie.id}
                      button
                      onClick={() => {
                        setSelectedMovie(serie);
                        setModalShow(true);
                        setsearchResultMovie("");
                        setsearchResultSeries("");
                      }}
                    >
                      <ListItemText primary={serie.title} />
                      <img
                        src={serie.poster}
                        alt={serie.title}
                        style={{
                          width: "50px",
                          height: "75px",
                          borderRadius: "8px",
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>

          <IconButton
            edge="end"
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              padding: "8px",
              width: "50px",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "black",
                color: "white",
                padding: "20px",
                width: "250px",
                borderTopLeftRadius: "15px",
                borderBottomLeftRadius: "15px",
              },
            }}
          >
            <List>
              {["Logout", "About Us"].map((text) => (
                <ListItem
                  button
                  key={text}
                  onClick={() => {
                    if (text === "Logout") {
                      localStorage.clear();
                      nav("/login");
                    }
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "red" },
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText primary={text} />
                </ListItem>
              ))}
              {userId == 1 || userId == 2 || userId == 3 ? (
                <ListItem
                  button
                  key="Admin Dashboard"
                  onClick={() => nav("/admin-dashboard")}
                  sx={{
                    "&:hover": { backgroundColor: "red" },
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              ) : null}
            </List>
          </Drawer>
        </Toolbar>
      </Container>
      {selectedMovie && (
        <MovieModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
          movie={selectedMovie}
        />
      )}
    </AppBar>
  );
}

export default Navbar;
