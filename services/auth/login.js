const { loginUser } = require('../../model/query/auth');

const login = async (req, res) => {
  try {
    const loginResponse = await loginUser(req.body.email, req.body.password);
    
    if (loginResponse.type === 'error') {
      let statusCode = 400;
      
      if (loginResponse.message === 'Користувача не знайдено') {
        statusCode = 404;
      } else if (loginResponse.message === 'Невірний пароль') {
        statusCode = 401;
      }
      
      return res.status(statusCode).json(loginResponse);
    }

    res.json(loginResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Внутрішня помилка сервера',
      type: 'error'
    });
  }
};

module.exports = { login };