const express = require('express');
const router = express.Router();
const db = require('../config/database');

// หน้ารีวิว (GET)
router.get('/:sitterId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const sitterId = req.params.sitterId;
  const userId = req.session.user.id;

  // ดึงข้อมูลพี่เลี้ยง
  const sqlSitter = `SELECT * FROM sitters WHERE id = ?`;
  db.get(sqlSitter, [sitterId], (err, sitter) => {
    if (err) {
      return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: 'เกิดข้อผิดพลาด', success: null });
    }
    if (!sitter) {
      return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: 'ไม่พบพี่เลี้ยง', success: null });
    }
    if (sitter.user_id === userId) {
      return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: '❌ คุณไม่สามารถรีวิวตัวเองได้', success: null });
    }

    // ดึงรีวิวทั้งหมด
    const sqlReviews = `SELECT r.rating, r.comment, u.name as user
                        FROM reviews r
                        JOIN users u ON r.user_id = u.id
                        WHERE r.sitter_id = ?`;
    db.all(sqlReviews, [sitterId], (err2, reviews) => {
      if (err2) {
        return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: 'เกิดข้อผิดพลาด', success: null });
      }
      res.render('reviews', { sitterId, reviews, user: req.session.user, error: null, success: null });
    });
  });
});


// POST รีวิว
router.post('/:sitterId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const sitterId = req.params.sitterId;
  const userId = req.session.user.id;
  const { rating, comment } = req.body;

  const sqlCheck = `SELECT user_id FROM sitters WHERE id = ?`;
  db.get(sqlCheck, [sitterId], (err, sitter) => {
    if (err || !sitter) {
      return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: 'ไม่พบพี่เลี้ยง', success: null });
    }

    // ❌ กันรีวิวตัวเอง
    if (sitter.user_id === userId) {
      return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: '❌ คุณไม่สามารถรีวิวตัวเองได้', success: null });
    }

    // ✅ บันทึกรีวิว
    const sqlInsert = `INSERT INTO reviews (user_id, sitter_id, rating, comment) VALUES (?, ?, ?, ?)`;
    db.run(sqlInsert, [userId, sitterId, rating, comment], function (err2) {
      if (err2) {
        return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: 'เกิดข้อผิดพลาดในการบันทึก', success: null });
      }

      // ✅ แสดงรีวิวใหม่
      const sqlReviews = `SELECT r.rating, r.comment, u.name as user
                          FROM reviews r
                          JOIN users u ON r.user_id = u.id
                          WHERE r.sitter_id = ?`;
      db.all(sqlReviews, [sitterId], (err3, reviews) => {
        if (err3) {
          return res.render('reviews', { sitterId, reviews: [], user: req.session.user, error: 'เกิดข้อผิดพลาดหลังบันทึก', success: null });
        }
        res.render('reviews', { sitterId, reviews, user: req.session.user, error: null, success: '🎉 รีวิวถูกบันทึกเรียบร้อย!' });
      });
    });
  });
});

module.exports = router;
