// ================================
// 🐾 PetSitter Platform — Server
// ================================
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Routes
const authRoutes = require('./routes/auth');
const sitterRoutes = require('./routes/sitters');
const bookingRoutes = require('./routes/booking');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// Middleware
// ================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // ระบุ path ให้ชัดเจน

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'petsitter_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// ส่งค่าผู้ใช้ไปทุก view (เพื่อแสดงใน header)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ================================
// Routes
// ================================
app.use('/', authRoutes);
app.use('/sitters', sitterRoutes);
app.use('/booking', bookingRoutes);
app.use('/reviews', reviewRoutes);

// ================================
// 404 Not Found
// ================================
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
