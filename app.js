// require packages used in the project
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Restaurant = require('./models/restaurant');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);

// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on('error', () => {
    console.log('mongodb error!');
});
// 連線成功
db.once('open', () => {
    console.log('mongodb connected!');
});

// const restaurantList = require('./restaurants.json');

const app = express();
const port = 3000;

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));

// setting static files
app.use(express.static('public'));

// routes setting
app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurants => {
            const message = `您的清單中有${restaurants.length}間餐廳`;
            res.render('index', { restaurants, message });
        })
        .catch(error => console.error(error));
});

app.get('/restaurants/new', (req, res) => {
    return res.render('new');
});

app.post('/restaurants', (req, res) => {
    return Restaurant.create(req.body)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));
});

// set dynamic routes
app.get('/restaurants/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id;
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => res.render('show', { restaurant }))
        .catch(error => console.log(error));
});

// page of edit restaurant
app.get("/restaurants/:restaurant_id/edit", (req, res) => {
    const id = req.params.restaurant_id;
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render("edit", { restaurant }))
        .catch(err => console.log(err));
});

// edit restaurant
app.post('/restaurants/:restaurant_id/edit', (req, res) => {
    const id = req.params.restaurant_id;
    return Restaurant.findByIdAndUpdate(id, req.body)
        .lean()
        .then(() => res.redirect(`/restaurants/${id}`))
        .catch(error => console.log(error));
});

// * not refactored yet
// show search results 
app.get('/search', (req, res) => {
    let message;
    // 對字串中的空白進行處理 → replace(/ /g, "")
    // str.trim() 不會移除中間的空白，只移除前後的空白
    // str.replaceAll() 在 node.js 15.0.0 後才可使用
    const keyword = req.query.keyword.replace(/ /g, "").toLowerCase();
    const restaurants = restaurantList.results.filter(restaurant => {
        const restaurantName = restaurant.name.replace(/ /g, "").toLowerCase();
        const restaurantEngName = restaurant.name_en.replace(/ /g, "").toLowerCase();
        const restaurantCategory = restaurant.category.replace(/ /g, "").toLowerCase();
        return restaurantName.includes(keyword) || restaurantEngName.includes(keyword) || restaurantCategory.includes(keyword);
    });

    // 若輸入為空白，則顯示提示語句
    if (!keyword) {
        message = '請輸入正確的關鍵字！';
        return res.render('index', { restaurants: null, keyword: req.query.keyword, message });
    }

    // 若找無符合關鍵字的結果，則隨機推薦餐廳
    if (restaurants.length === 0) {
        message = `沒有找到符合關鍵字的結果，但您可能會喜歡：`;
        const randomIDs = randomNums(1, restaurantList.results.length, 3);
        const randomRestaurants = restaurantList.results.filter(restaurant => {
            return randomIDs.includes(restaurant.id);
        });
        return res.render('index', { restaurants: randomRestaurants, keyword: req.query.keyword, message });
    }

    // 顯示找到符合關鍵字的結果
    message = `找到${restaurants.length}個符合關鍵字的結果`;
    res.render('index', { restaurants, keyword: req.query.keyword, message });
});

// start and listen on the Express server
app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`);
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