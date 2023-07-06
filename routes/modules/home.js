const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

// default sorting: id
router.get('/', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then((restaurants) => {
      const message = `您的清單中有${restaurants.length}間餐廳`;
      res.render('index', { restaurants, message });
    })
    .catch((error) => console.error(error));
});

// sorting function
router.get('/name', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort({ name: 'asc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error));
});

router.get('/-name', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort({ name: 'desc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error));
});

router.get('/category', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort({ category: 'asc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error));
});

router.get('/location', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort({ location: 'asc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error));
});

router.get('/rating', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort({ rating: 'desc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.error(error));
});

router.get('/favorite', (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .then((restaurants) => {
      const filteredRestaurants = restaurants.filter(
        (restaurant) => restaurant.isFavorite === true
      );
      return res.render('index', { restaurants: filteredRestaurants });
    })
    .catch((error) => console.error(error));
});

module.exports = router;
