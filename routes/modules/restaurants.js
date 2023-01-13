const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

// show new page
router.get('/new', (req, res) => {
    return res.render('new');
});

// create new restaurant
router.post('/', (req, res) => {
    return Restaurant.create(req.body)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));
});

// show restaurant by id
router.get('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id;
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => res.render('show', { restaurant }))
        .catch(error => console.log(error));
});

// show edit restaurant page
router.get("/:restaurant_id/edit", (req, res) => {
    const id = req.params.restaurant_id;
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(err => console.log(err));
});

// edit restaurant
router.put('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id;
    const editedData = {
        ...req.body,
        isFavorite: req.body.isFavorite === 'on' ? true : false
    };
    return Restaurant.findByIdAndUpdate(id, editedData)
        .lean()
        .then(() => res.redirect(`/restaurants/${id}`))
        .catch(error => console.log(error));
});

// delete restaurant
router.delete('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id;
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error));
});

module.exports = router;