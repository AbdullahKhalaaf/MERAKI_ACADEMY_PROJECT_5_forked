const express = require("express");

const {
  addToMovieFavorite,
  removeFromFavorite,
  getFavoriteMovies,
  addToSeriesFavorite,
  getFavoriteSeries,
} = require("../controllers/favorite");

const FavoriteRouter = express.Router();

const authentication = require("../middlewares/authentication");

FavoriteRouter.post("/addMovie", authentication, addToMovieFavorite);
FavoriteRouter.post("/addSeries", authentication, addToSeriesFavorite);
FavoriteRouter.delete("/remove/:id", authentication, removeFromFavorite);

// get all favorite list
// FavoriteRouter.get("/", authentication, getFavorite);
FavoriteRouter.get("/movies", authentication, getFavoriteMovies);
FavoriteRouter.get("/series", authentication, getFavoriteSeries);

module.exports = FavoriteRouter;
