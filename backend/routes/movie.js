const express = require("express");
const movieRouter = express.Router();
const { addMovie, getMovies, getMovieById } = require("../controllers/movie");

movieRouter.post("/addMovie", addMovie);

//http://localhost:5000/movie
movieRouter.get("/", getMovies);

// http://localhost:5000/movie/$id
movieRouter.get("/:id", getMovieById);

module.exports = movieRouter;
