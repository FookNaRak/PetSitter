const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET: หน้าแบบฟอร์มจอง
router.get('/:sitterId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const sitterId = req.params.sitterId;
  const userId = req.session.user.id;

  const sqlCheck = `SELECT user_id FROM sitters WHERE id = ?`;
  db.get(sqlCheck, [sitterId], (err, sitter) => {
    if (err) {
      return res.render('booking', { sitterId, user: req.session.user, error: 'เกิดข้อผิดพลาดในระบบ', success: null });
    }
    if (!sitter) {
      return res.render('booking', { sitterId, user: req.session.user, error: 'ไม่พบพี่เลี้ยงที่คุณเลือก', success: null });
    }
    if (sitter.user_id === userId) {
      return res.render('booking', { sitterId, user: req.session.user, error: '⚠️ คุณไม่สามารถจองพี่เลี้ยงของตัวเองได้', success: null });
    }

    // ✅ ไม่มี error
    res.render('booking', { sitterId, user: req.session.user, error: null, success: null });
  });
});


// POST: ยืนยันการจอง
router.post('/:sitterId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const sitterId = req.params.sitterId;
  const userId = req.session.user.id;
  const { date, time } = req.body;

  const sqlCheck = `SELECT user_id FROM sitters WHERE id = ?`;
  db.get(sqlCheck, [sitterId], (err, sitter) => {
    if (err) {
      return res.render('booking', { sitterId, user: req.session.user, error: 'เกิดข้อผิดพลาดในระบบ', success: null });
    }
    if (!sitter) {
      return res.render('booking', { sitterId, user: req.session.user, error: 'ไม่พบพี่เลี้ยงที่คุณเลือก', success: null });
    }
    if (sitter.user_id === userId) {
      return res.render('booking', { sitterId, user: req.session.user, error: '⚠️ ไม่สามารถจองตัวเองได้', success: null });
    }

    // ✅ insert
    const sqlInsert = `INSERT INTO bookings (user_id, sitter_id, date, time) VALUES (?, ?, ?, ?)`;
    db.run(sqlInsert, [userId, sitterId, date, time], function (err2) {
      if (err2) {
        return res.render('booking', { sitterId, user: req.session.user, error: 'เกิดข้อผิดพลาดขณะจอง', success: null });
      }

      res.render('booking', { sitterId, user: req.session.user, error: null, success: '🎉 จองคิวสำเร็จแล้ว!' });
    });
  });
});

module.exports = router;
