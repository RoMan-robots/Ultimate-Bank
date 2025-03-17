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
    const result = await registerUser(name, email, password);

    if(result.type === 'success') {
      return res.status(201).json({ message: result.message, type: result.type});
    }

    return res.status(400).json({ error: result.message, type: result.type });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error', type: 'error' });
  }
});

module.exports = router;