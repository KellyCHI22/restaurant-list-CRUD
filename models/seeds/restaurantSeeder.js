const db = require('../../config/mongoose');
const Restaurant = require('../restaurant');
const restaurantData = require('../../restaurants.json').results;

db.once('open', () => {
    Restaurant.create(restaurantData)
        .then(() => {
            console.log('restaurantSeeder done!');
            db.close();
        })
        .catch(err => console.log(err));
});