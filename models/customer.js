const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(11).max(14).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
module.exports.customerSchema = customerSchema;
