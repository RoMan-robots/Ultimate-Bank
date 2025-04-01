const { registerUser } = require('../../model/query/auth');

const register = async (req, res) => {

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
    return res.status(500).json({ error: error.message, type: 'error' });
  }
};

module.exports = { register };