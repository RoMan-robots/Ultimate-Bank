var express = require('express');
var router = express.Router();
var { login } = require("../../services/auth/login");

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', login);

module.exports = router;