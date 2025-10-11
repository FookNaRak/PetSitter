const express = require('express');
const router = express.Router();
const db = require('../config/database');

// หน้า form สมัครพี่เลี้ยง
router.get('/register', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('registerSitter', { user: req.session.user, error: null, success: null });
});

// POST สมัครพี่เลี้ยง
router.post('/register', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const { experience, price, location } = req.body;
  const user_id = req.session.user.id;

  if (!experience || !price || !location) {
    return res.render('registerSitter', { user: req.session.user, error: 'กรุณากรอกข้อมูลให้ครบ', success: null });
  }

  // ตรวจว่าผู้ใช้นี้เคยสมัคร sitter แล้วหรือยัง
  db.get(`SELECT * FROM sitters WHERE user_id = ?`, [user_id], (err, existing) => {
    if (err) return res.render('registerSitter', { user: req.session.user, error: 'เกิดข้อผิดพลาดในระบบ', success: null });
    if (existing) {
      return res.render('registerSitter', { user: req.session.user, error: 'คุณสมัครเป็นพี่เลี้ยงไปแล้ว', success: null });
    }

    const stmt = `INSERT INTO sitters (user_id, name, experience, price, location) VALUES (?, ?, ?, ?, ?)`;
    db.run(stmt, [user_id, req.session.user.name, experience, price, location], function (err2) {
      if (err2) return res.render('registerSitter', { user: req.session.user, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', success: null });
      res.render('registerSitter', { user: req.session.user, success: '🎉 สมัครเป็นพี่เลี้ยงสำเร็จ!', error: null });
    });
  });
});

// รายชื่อพี่เลี้ยง
router.get('/', (req, res) => {
  db.all(`SELECT * FROM sitters`, (err, sitters) => {
    if (err) return res.render('sitters', { sitters: [], user: req.session.user, error: 'ไม่สามารถโหลดรายชื่อได้' });
    res.render('sitters', { sitters, user: req.session.user, error: null });
  });
});

// โปรไฟล์พี่เลี้ยง
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM sitters WHERE id = ?`, [id], (err, sitter) => {
    if (err || !sitter) return res.send('ไม่พบพี่เลี้ยง');

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
          user: req.session.user
        });
      }
    );
  });
});

module.exports = router;
