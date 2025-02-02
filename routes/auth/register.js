var express = require('express');
var router = express.Router();
var { registerUser } = require('../../model/query/auth');

router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', async function(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length <  4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long' });
  }

  try {
    const token = await registerUser(name, email, password);

    if (!token) {
      return res.status(409).json({ error: 'User already exists or registration failed' });
    }

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;