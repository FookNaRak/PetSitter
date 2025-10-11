const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// session
app.use(session({
  secret: 'petsitter_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/', require('./routes/auth'));
app.use('/sitters', require('./routes/sitters'));
app.use('/booking', require('./routes/booking'));
app.use('/review', require('./routes/reviews'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
