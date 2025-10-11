const express = require('express');
const router = express.Router();
const db = require('../database');

// หน้า booking form
router.get('/:sitterId', (req, res) => {
  if(!req.session.user) return res.redirect('/login');
  res.render('booking', { sitterId: req.params.sitterId, user: req.session.user });
});

// POST booking
router.post('/:sitterId', (req, res) => {
  if(!req.session.user) return res.redirect('/login');
  const { date, time } = req.body;
  const user_id = req.session.user.id;

  const sql = `INSERT INTO bookings (user_id, sitter_id, date, time) VALUES (?, ?, ?, ?)`;
  db.run(sql, [user_id, req.params.sitterId, date, time], function(err){
    if(err) return res.send(err.message);
    res.send('จองคิวสำเร็จ! <a href="/sitters">กลับไปหน้ารายชื่อ</a>');
  });
});

module.exports = router;
