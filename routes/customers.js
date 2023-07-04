const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');

const router = express.Router();

// get all customers
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

// get a specific customer
router.get('/:customerId', async (req, res) => {
  const customer = await Customer.findById(req.params.customerId);
  if (!customer) return res.status(404).send('Customer not found!!!');
  res.send(customer);
});

// create a new customer
router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  const newCustomer = await customer.save();

  res.send(newCustomer);
});

// update a customer
router.put('/:customerId', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.customerId,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );

  if (!customer) return res.status(404).send('Customer not found!!!');

  res.send(customer);
});

//delete a customer
router.delete('/:customerId', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.customerId);
  if (!customer) return res.status(404).send('Customer not found!!!');

  res.send(customer);
});

module.exports = router;
