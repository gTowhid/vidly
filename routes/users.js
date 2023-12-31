const _ = require('lodash');
const authorization = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/user');

const router = express.Router();

// get all users
router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

// get logged in user
router.get('/me', authorization, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// create a new user
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  const salt = await bcrypt.genSalt(10);

  // user = new User(_.pick(req.body, ['name', 'email', 'password'])); // does the same thing as the below codeblock
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  });

  // user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
