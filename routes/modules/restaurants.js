const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

// show new page
router.get('/new', (req, res) => {
  return res.render('new');
});

// create new restaurant
router.post('/', (req, res) => {
  const userId = req.user._id;
  return Restaurant.create({ ...req.body, userId })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));
});

// show restaurant by id
router.get('/:restaurant_id', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch((error) => console.log(error));
});

// show edit restaurant page
router.get('/:restaurant_id/edit', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((err) => console.log(err));
});

// edit restaurant
router.put('/:restaurant_id', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  const editedData = {
    ...req.body,
    isFavorite: req.body.isFavorite === 'on' ? true : false,
  };
  console.log(editedData);
  return Restaurant.findOneAndUpdate({ _id, userId }, editedData, {
    new: true,
  })
    .lean()
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.log(error));
});

// delete restaurant
router.delete('/:restaurant_id', (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurant_id;
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
});

module.exports = router;
