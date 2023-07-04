const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi'); // These two are imported for central usage on all modules
Joi.objectId = require('joi-objectid')(Joi); // These two are imported for central usage on all modules
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const app = express();
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

// configuring the port & listener
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));