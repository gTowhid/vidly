const express = require('express');
const { Genre, validateGenre } = require('../models/genre');
const authorization = require('../middleware/auth');
const adminAccess = require('../middleware/admin');

const router = express.Router();

// get all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// get a specific genre
router.get('/:genreId', async (req, res) => {
  const genre = await Genre.findById(req.params.genreId);
  if (!genre) return res.status(404).send('Genre not found!!!');
  res.send(genre);
});

// create a new genre
router.post('/', authorization, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  const newGenre = await genre.save();

  res.send(newGenre);
});

// update a genre
router.put('/:genreId', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.genreId,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) return res.status(404).send('Genre not found!!!');

  res.send(genre);
});

//delete a genre
router.delete('/:genreId', [authorization, adminAccess], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.genreId);
  if (!genre) return res.status(404).send('Genre not found!!!');

  res.send(genre);
});

module.exports = router;
