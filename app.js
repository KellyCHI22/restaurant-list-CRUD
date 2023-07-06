// require packages used in the project
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');

// require restaurant model
const Restaurant = require('./models/restaurant');
// require routes
const routes = require('./routes');

const usePassport = require('./config/passport');
// require mongoose
require('./config/mongoose');

// app related stuff
const app = express();
const port = 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

usePassport(app);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
});

app.use(routes);

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
