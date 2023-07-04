const express = require('express');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

const router = express.Router();

// get all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

// get a specific movie
router.get('/:movieId', async (req, res) => {
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) return res.status(404).send('Movie not found!!!');
  res.send(movie);
});

// create a new movie
router.post('/', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send('Genre not found!!!');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  const newMovie = await movie.save();

  res.send(newMovie);
});

// update a movie
router.put('/:movieId', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send('Genre not found!!!');

  const movie = await Movie.findByIdAndUpdate(
    req.params.movieId,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send('Movie not found!!!');

  res.send(movie);
});

//delete a movie
router.delete('/:movieId', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.movieId);
  if (!movie) return res.status(404).send('Movie not found!!!');

  res.send(movie);
});

module.exports = router;
