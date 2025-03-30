var express = require('express');
var router = express.Router();
var { goldenWallet } = require("../services/goldenWallet");

router.get('/', function(req, res, next) {
  res.render('goldenWallet');
});

router.post('/', goldenWallet);

module.exports = router;