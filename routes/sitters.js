const express = require('express');
const router = express.Router();
const db = require('../database');

// หน้า form สมัครพี่เลี้ยง
router.get('/register', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // ต้อง login ก่อน
  }
  res.render('registerSitter', { user: req.session.user });
});

// POST สมัครพี่เลี้ยง
router.post('/register', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { experience, price, location } = req.body;
  const user_id = req.session.user.id;

  const stmt = `INSERT INTO sitters (user_id, name, experience, price, location) VALUES (?, ?, ?, ?, ?)`;
  db.run(stmt, [user_id, req.session.user.name, experience, price, location], function(err){
    if(err) return res.send(err.message);
    res.redirect('/sitters/' + this.lastID); // ไปหน้าโปรไฟล์พี่เลี้ยง
  });
});


// รายชื่อพี่เลี้ยง
router.get('/', (req, res) => {
  db.all(`SELECT * FROM sitters`, (err, sitters) => {
    if (err) return res.send(err.message);
    res.render('sitters', { sitters, user: req.session.user }); // ส่ง user ด้วย
  });
});



// โปรไฟล์พี่เลี้ยง
router.get('/:id', (req, res) => {
  const id = req.params.id;

  // ดึงข้อมูลพี่เลี้ยง
  db.get(`SELECT * FROM sitters WHERE id = ?`, [id], (err, sitter) => {
    if (err) return res.send(err.message);
    if (!sitter) return res.send('Sitter not found');

    // ดึงรีวิวของพี่เลี้ยงคนนี้ พร้อม join ชื่อ user
    db.all(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.sitter_id = ? 
       ORDER BY r.created_at DESC`,
      [id],
      (err2, reviews) => {
        if (err2) return res.send(err2.message);

        res.render('sitterProfile', {
          sitter,
          reviews,
          user: req.session.user // ส่ง user ไป header
        });
      }
    );
  });
});



module.exports = router;
