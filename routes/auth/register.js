var express = require('express');
var router = express.Router();
var { register } = require("../../services/auth/register");

router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', register);

module.exports = router;