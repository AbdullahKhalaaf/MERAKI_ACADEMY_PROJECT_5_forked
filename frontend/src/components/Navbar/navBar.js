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
import "./navBar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGenre } from "../../service/redux/reducers/genre/genreSlice";
const pages = ["Movies", "Series", "Genre"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElGenre, setAnchorElGenre] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genre.genre);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movie/genre")
      .then((res) => {
        console.log("Genres API Response:", res.data.result);

        dispatch(setGenre(res.data.result));
      })
      .catch((error) => console.error("Error fetching genres", error));
  }, [dispatch]);

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
                    onClick={() => nav(`/${page.toLowerCase()}`)}
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
                  onClick={() => nav(`/${page.toLowerCase()}`)}
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

          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              mr: 1,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={() => nav("/login")}
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "white",
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
              mr: 1,
              width: "100px",
            }}
          >
            Login
          </Button>

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
              {["Profile", "About Us", "Admin Dashboard"].map((text) => (
                <ListItem
                  button
                  key={text}
                  onClick={() => {
                    if (text === "Admin Dashboard") {
                      nav(`/admin-dashboard`);
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
            </List>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
