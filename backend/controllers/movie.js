const pool = require("../models/db");

const addMovie = (req, res) => {
  const {
    title,
    description,
    genre,
    trailer,
    poster,
    rate,
    actors,
    director,
    writers,
    created_at,
  } = req.body;
  const query = `insert into movies (title,
    description,
    genre,
    trailer,
    poster,
    rate,
    actors,
    director,
    writers,
    created_at) Values ('${title}','${description}','${genre}','${trailer}','${poster}','${rate}','${actors}','${director}','${writers}','${created_at}') RETURNING *`;

  pool
    .query(query)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "the movie added successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "error while adding the movie",
        error: err.message,
      });
    });
};

const getMovies = (req, res) => {
  const query = `select * from movies  WHERE is_deleted=0`;
  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "getting all movies",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: "failed to get movies",
        error: err.message,
      });
    });
};

const deleteMovieById = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE movies SET is_deleted = 1 WHERE id= $1;`;
  const data = [id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Movie with id: ${id}  deleted successfully`,
        });
      } else {
        throw new Error("Error happened while deleting movie");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    });
};

const getMovieByActorId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT movies.* , actors.actor_name
    FROM movies
    LEFT JOIN movies_actor ON movies.id = movies_actor.movie_id
    LEFT JOIN actors ON movies_actor.actor_id = actors.id
    WHERE actors.id = $1 AND movies.is_deleted = 0;
  `;

  pool
    .query(query, [id])
    .then((result) => {
      console.log("result", result);

      res.status(200).json({
        success: true,
        message: "Movies getting successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      console.log("err", err);

      res.status(500).json({
        success: false,
        message: "Error getting movies",
        error: err.message,
      });
    });
};

const getMoviesByDirectorId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT movies.*, directors.director_name , directors.avatar
    FROM movies
    LEFT JOIN directors ON movies.director_id = directors.id
    WHERE directors.id = $1 AND movies.is_deleted = 0;
  `;

  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Movies by the director getting successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error getting movies by director",
        error: err.message,
      });
    });
};

const getMoviesByWriterId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT movies.*, writers.writer_name, writers.avatar
    FROM movies
    LEFT JOIN writers ON movies.writer_id = writers.id
    WHERE writers.id = $1 AND movies.is_deleted = 0;
  `;

  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Movies by the writer getted successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error getting movies by writer",
        error: err.message,
      });
    });
};

module.exports = {
  addMovie,
  getMovies,
  deleteMovieById,
  getMovieByActorId,
  getMoviesByDirectorId,
  getMoviesByWriterId,
};
