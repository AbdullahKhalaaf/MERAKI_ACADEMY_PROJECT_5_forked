const pool = require("../models/db");

const addSeries = (req, res) => {
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
    episodes,
    created_at,
  } = req.body;
  const query = `insert into series (title , description , genre , trailer , poster , rate , actors , director , writers , episodes , created_at) Values ('${title}','${description}','${genre}','${trailer}','${poster}','${rate}','${actors}','${director}','${writers}','${episodes}','${created_at}') RETURNING *`;
  pool
    .query(query)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "series added successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "error in adding the series",
        error: err.message,
      });
    });
};

const getSeries = (req, res) => {
  const query = `select * from series WHERE is_deleted=0`;
  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "getting all series",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: "error while getting series",
        error: err.message,
      });
    });
};

const getSeriesById = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM series WHERE id = ${id}`;

  pool
    .query(query)
    .then((result) => {
      if (result.rowCount > 0) {
        return res.status(200).json({
          success: true,
          message: `getting the series with id : ${id}`,
          result: result.rows,
        });
      } else {
        res.status(404).json({
          success: false,
          message: `there is no series with id : ${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "server error",
        error: err.message,
      });
    });
};

const deleteSeriesById = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE series SET is_deleted = 1 WHERE id= $1;`;
  const data = [id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Series with id: ${id}  deleted successfully`,
        });
      } else {
        throw new Error("Error happened while deleting series");
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

module.exports = { addSeries, getSeries, getSeriesById, deleteSeriesById };
