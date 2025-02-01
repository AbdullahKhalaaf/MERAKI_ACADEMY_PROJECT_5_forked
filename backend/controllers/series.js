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

const getSeries = (req , res)=>{
    const query = `select * from series`
    pool.query(query).then((result)=>{
        res.status(200).json({
            success : true,
            message : 'getting all series',
            result : result.rows
        })
    }).catch((err)=>{
        res.status(404).json({
            success : false,
            message : 'error while getting series',
            error : err.message
        })
    })
}

module.exports = { addSeries , getSeries };
