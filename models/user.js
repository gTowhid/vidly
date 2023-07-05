const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
});

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validateUser = validateUser;
