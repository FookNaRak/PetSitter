const express = require('express');
const router = express.Router();
const db = require('../database');

// หน้ารีวิว
router.get('/:sitterId', (req, res) => {
  if(!req.session.user) return res.redirect('/login');
  const sql = `SELECT r.rating, r.comment, u.name as user
               FROM reviews r
               JOIN users u ON r.user_id = u.id
               WHERE r.sitter_id = ?`;
  db.all(sql, [req.params.sitterId], (err, reviews) => {
    if(err) return res.send(err.message);
    res.render('reviews', { sitterId: req.params.sitterId, reviews, user: req.session.user });
  });
});

// POST รีวิว
router.post('/:sitterId', (req, res) => {
  if(!req.session.user) return res.redirect('/login');
  const { rating, comment } = req.body;
  const user_id = req.session.user.id;

  const sql = `INSERT INTO reviews (user_id, sitter_id, rating, comment) VALUES (?, ?, ?, ?)`;
  db.run(sql, [user_id, req.params.sitterId, rating, comment], function(err){
    if(err) return res.send(err.message);
    res.redirect('/sitters/' + req.params.sitterId); // redirect กลับหน้าโปรไฟล์
  });
});

module.exports = router;
