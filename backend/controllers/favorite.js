const pool = require("../models/db");

const addToMovieFavorite = (req, res) => {
  const user_id = req.token.userId;
  const { movie_id } = req.body;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }

  if (!movie_id) {
    return res.status(400).json({
      success: false,
      message: "Provide either a movie_id or a series_id, not both",
    });
  }

  const query = `INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *`;
  const values = [user_id, movie_id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Added to favorites successfully",
        favorite: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    });
};

const addToSeriesFavorite = (req, res) => {
  const user_id = req.token.userId;
  const { series_id } = req.body;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }

  if (!series_id) {
    return res.status(400).json({
      success: false,
      message: "Provide either a movie_id or a series_id, not both",
    });
  }

  const query = `INSERT INTO favorites (user_id, series_id) VALUES ($1, $2) RETURNING *`;
  const values = [user_id, series_id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Added to favorites successfully",
        favorite: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    });
};

const removeFromFavorite = (req, res) => {
  const user_id = req.token.userId;
  const { movie_id, series_id } = req.body;

  if (!movie_id && !series_id) {
    return res.status(400).json({
      success: false,
      message: "Provide either a movie_id or a series_id",
    });
  }

  const query = `DELETE FROM favorites WHERE user_id = $1 AND (movie_id = $2 OR series_id = $3) RETURNING *`;
  const values = [user_id, movie_id || null, series_id || null];

  pool
    .query(query, values)
    .then((result) => {
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Favorite not found" });
      }
      res.status(200).json({
        success: true,
        message: "Removed from favorites successfully",
        favorite: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    });
};

// const getFavorite = (req, res) => {
//   const user_id = req.token.userId;
//   if (!user_id) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Please login to see your list" });
//   }

//   const query = `SELECT
//   favorites.*,
//   movies.title AS movie_title,
//   movies.poster AS movie_poster,
//   movies.description AS movie_description,
//   movies.rate AS movie_rate,
//   movies.trailer AS movie_trailer,
//   series.title AS series_title,
//   series.poster AS series_poster,
//   series.description AS series_description,
//   series.trailer AS series_trailer
// FROM favorites
// LEFT JOIN movies ON favorites.movie_id = movies.id
// LEFT JOIN series ON favorites.series_id = series.id
// WHERE favorites.user_id = $1;
// ;
// ;
//   `;
//   pool
//     .query(query, [user_id])
//     .then((result) => {
//       if (result.rows.length === 0) {
//         return res.status(200).json({
//           success: true,
//           message: "Your favorite list is empty",
//           result: [],
//         });
//       }
//       res.status(200).json({
//         success: true,
//         message: `The favorite list for user with id: ${user_id}`,
//         result: result.rows,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         success: false,
//         message: "Database error",
//         error: err.message,
//       });
//     });
// };

const getFavoriteMovies = (req, res) => {
  const user_id = req.token.userId;
  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "Please login to see your list" });
  }
  const query = `SELECT favorites.*, 
   movies.title AS movie_title,
   movies.poster AS movie_poster,
   movies.description AS movie_description,
   movies.rate AS movie_rate,
   movies.trailer AS movie_trailer
  FROM favorites
 LEFT JOIN movies ON favorites.movie_id = movies.id
 WHERE favorites.user_id = $1

  `;
  pool
    .query(query, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Your favorite list is empty",
          result: [],
        });
      }
      res.status(200).json({
        success: true,
        message: `The favorite list for user with id: ${user_id}`,
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    });
};
const getFavoriteSeries = (req, res) => {
  const user_id = req.token.userId;
  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: "Please login to see your list" });
  }
  const query = `SELECT favorites. *,
       series.title AS series_title,
   series.poster AS series_poster,
  series.description AS series_description,
   series.trailer AS series_trailer
  FROM favorites
 LEFT JOIN series ON favorites.series_id = series.id
 WHERE favorites.user_id = $1
  `;
  pool
    .query(query, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Your favorite list is empty",
          result: [],
        });
      }
      res.status(200).json({
        success: true,
        message: `The favorite list for user with id: ${user_id}`,
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    });
};

module.exports = {
  addToMovieFavorite,
  addToSeriesFavorite,
  removeFromFavorite,
  getFavoriteMovies,
  getFavoriteSeries,
};
