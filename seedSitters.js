const db = require('./database');

const sitters = [
  { name: 'น้องหมาแมว', experience: '3 ปี', price: '500/วัน', area: 'กรุงเทพฯ' },
  { name: 'เพื่อนรักสัตว์', experience: '5 ปี', price: '700/วัน', area: 'เชียงใหม่' },
  { name: 'สัตว์เลี้ยงใจดี', experience: '2 ปี', price: '400/วัน', area: 'ชลบุรี' }
];

sitters.forEach(s => {
  db.run(`INSERT INTO sitters (name, experience, price, area) VALUES (?, ?, ?, ?)`,
    [s.name, s.experience, s.price, s.area]);
});

console.log('Sitters added.');
db.close();
