const express = require("express");
const movieRouter = express.Router();
const {
  addMovie,
  getMovies,
  deleteMovieById,
  getMovieByActorId,
  getMoviesByDirectorId,
  getMoviesByWriterId,
} = require("../controllers/movie");

movieRouter.post("/addMovie", addMovie);

// http://localhost:5000/movie
movieRouter.get("/", getMovies);

movieRouter.get("/actor/:id", getMovieByActorId);
movieRouter.get("/director/:id", getMoviesByDirectorId);
movieRouter.get("/writer/:id", getMoviesByWriterId);

//http://localhost:5000/movie/$id
movieRouter.put("/:id", deleteMovieById);

module.exports = movieRouter;
