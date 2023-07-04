const express = require('express');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

const router = express.Router();

// get all rentals
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

/* // get a specific movie
router.get('/:movieId', async (req, res) => {
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) return res.status(404).send('Movie not found!!!');
  res.send(movie);
}); */

// create a new rental
router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Movie not found!!!');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Customer not found!!!');

  if (movie.numberInStock === 0)
    return res.status(404).send('Movie not in stock!!!');

  const rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
  });

  const newRental = await rental.save();

  movie.numberInStock--;
  await movie.save();

  res.send(newRental);
});

/* // update a movie
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
}); */

/* //delete a movie
router.delete('/:movieId', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.movieId);
  if (!movie) return res.status(404).send('Movie not found!!!');

  res.send(movie);
}); */

module.exports = router;
