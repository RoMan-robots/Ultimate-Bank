var express = require('express');
var router = express.Router();
var { loginUser } = require('../../model/query/auth');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', async function(req, res, next) {
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
});

module.exports = router;