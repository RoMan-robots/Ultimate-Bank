var express = require('express');
var router = express.Router();
var { loginUser } = require('../../model/query/auth');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
   const loginResponse = loginUser(req.body.email, req.body.password)
  res.render(loginResponse);
});

module.exports = router;