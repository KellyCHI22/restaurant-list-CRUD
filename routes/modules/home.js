const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

// default sorting: id
router.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .sort({ _id: 'asc' })
        .then(restaurants => {
            const message = `您的清單中有${restaurants.length}間餐廳`;
            res.render('index', { restaurants, message });
        })
        .catch(error => console.error(error));
});

// sorting function
router.get('/name', (req, res) => {
    Restaurant.find()
        .lean()
        .sort({ name: 'asc' })
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error));
});

router.get('/-name', (req, res) => {
    Restaurant.find()
        .lean()
        .sort({ name: 'desc' })
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error));
});

router.get('/category', (req, res) => {
    Restaurant.find()
        .lean()
        .sort({ category: 'asc' })
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error));
});

router.get('/location', (req, res) => {
    Restaurant.find()
        .lean()
        .sort({ location: 'asc' })
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error));
});

router.get('/rating', (req, res) => {
    Restaurant.find()
        .lean()
        .sort({ rating: 'desc' })
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error));
});


module.exports = router;