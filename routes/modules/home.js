
const express = require('express');
const router = express.Router();

const Restaurant = require('../../models/restaurant');

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
// 匯出路由模組
module.exports = router;