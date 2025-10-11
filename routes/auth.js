const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

// หน้าแรก
router.get('/', (req, res) => res.render('index', { user: req.session.user }));

// หน้า login
router.get('/login', (req, res) => res.render('login'));

// หน้า register
router.get('/register', (req, res) => res.render('register'));

// POST register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, hashedPassword], function(err){
    if(err) return res.send('Email ซ้ำหรือมีข้อผิดพลาด');
    res.send('สมัครสมาชิกสำเร็จ! <a href="/login">เข้าสู่ระบบ</a>');
  });
});

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if(err || !user) return res.send('ไม่พบผู้ใช้');
    const match = await bcrypt.compare(password, user.password);
    if(match){
      req.session.user = { id: user.id, name: user.name };
      res.redirect('/');
    } else {
      res.send('รหัสผ่านไม่ถูกต้อง');
    }
  });
});

// logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
