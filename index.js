const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====

// Logger: ghi method + path + time
function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.path}`);
  next();
}

// Check age middleware (dùng riêng cho route GET)
function checkAge(req, res, next) {
  const age = parseInt(req.query.age, 10);

  if (!age || age < 18) {
    return res.status(400).json({
      ok: false,
      message: 'Tuổi phải >= 18'
    });
  }

  next();
}

// ===== Global middleware =====
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static file
app.use(express.static(path.join(__dirname, 'public')));

// ===== Routes =====

// GET /api/info?name=&age=
app.get('/api/info', checkAge, (req, res) => {
  const { name, age } = req.query;

  res.json({
    ok: true,
    name,
    age,
    message: `Xin chào ${name}!`
  });
});

// POST /api/register
app.post('/api/register', (req, res) => {
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({
      ok: false,
      message: 'Thiếu thông tin'
    });
  }

  res.json({
    ok: true,
    message: 'Đăng ký thành công',
    data: {
      id: Date.now(),
      name,
      age,
      email
    }
  });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
