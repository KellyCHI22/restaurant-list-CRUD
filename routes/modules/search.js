const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

// show search results 
router.get('/', (req, res) => {
    let message;
    const keyword = req.query.keyword.replace(/ /g, "").toLowerCase();
    // 若輸入為空白，則顯示提示語句
    if (!keyword) {
        message = '請輸入正確的關鍵字！';
        return res.render('index', { restaurants: null, keyword: req.query.keyword, message });
    }

    Restaurant.find({})
        .lean()
        .then(restaurants => {
            const filteredRestaurants = restaurants.filter(restaurant => {
                const restaurantName = restaurant.name.replace(/ /g, "").toLowerCase();
                const restaurantEngName = restaurant.name_en.replace(/ /g, "").toLowerCase();
                const restaurantCategory = restaurant.category.replace(/ /g, "").toLowerCase();
                return restaurantName.includes(keyword) || restaurantEngName.includes(keyword) || restaurantCategory.includes(keyword);
            });

            // 若找無符合關鍵字的結果，則隨機推薦餐廳
            if (filteredRestaurants.length === 0) {
                message = `沒有找到符合關鍵字的結果，但您可能會喜歡：`;
                const randomIDs = randomNums(1, restaurants.length - 1, 3);
                let randomRestaurants = [];
                for (let i = 0; i < randomIDs.length; i++) {
                    randomRestaurants.push(restaurants[randomIDs[i]]);
                }
                return res.render('index', { restaurants: randomRestaurants, keyword: req.query.keyword, message });
            }

            // 顯示找到符合關鍵字的結果
            message = `找到${filteredRestaurants.length}個符合關鍵字的結果`;
            res.render('index', { restaurants: filteredRestaurants, keyword: req.query.keyword, message });
        })
        .catch(err => console.log(err));
});


// 用來生成隨機數字陣列的函式
function randomNums(min, max, length) {
    const nums = [];
    while (nums.length < length) {
        let num = Math.floor(Math.random() * max) + min;
        if (!nums.includes(num)) {
            nums.push(num);
        }
    }
    return nums;
}

module.exports = router;