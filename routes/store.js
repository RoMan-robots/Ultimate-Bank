var express = require('express');
var router = express.Router();
var { allStoreItems, inventory, buy } = require('../services/store');

router.get('/', function(req, res, next) {
  res.render('store');
});

router.get('/all', allStoreItems);

router.post('/buy', buy);

router.get('/inventory/:userId', inventory);

module.exports = router;