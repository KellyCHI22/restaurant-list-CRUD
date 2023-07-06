const db = require('../../config/mongoose');
const bcrypt = require('bcryptjs');

const Restaurant = require('../restaurant');
const User = require('../user');
const restaurantData = require('../../restaurants.json').results;
const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: [1, 2, 3, 4],
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: [5, 6, 7, 8],
  },
];

db.once('open', () => {
  Promise.all(
    Array.from(SEED_USERS, (user) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(user.password, salt))
        .then((hash) =>
          User.create({
            name: user.name,
            email: user.email,
            password: hash,
          })
        )
        .then((userCreated) => {
          const filteredRestaurants = restaurantData.filter((item) =>
            user.restaurants.includes(item.id)
          );
          return Promise.all(
            Array.from({ length: filteredRestaurants.length }, (_, i) =>
              Restaurant.create({
                ...filteredRestaurants[i],
                userId: userCreated._id,
              })
            )
          );
        });
    })
  ).then(() => {
    console.log('Seed data created!');
    process.exit();
  });
});
