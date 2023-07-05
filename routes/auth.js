const _ = require('lodash');
const jwt = require('jsonwebtoken');
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

function validateUserLogin(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
  });

  return schema.validate(req);
}

// user login request
router.post('/', async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password!');

  const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');

  res.send(token);
});

module.exports = router;