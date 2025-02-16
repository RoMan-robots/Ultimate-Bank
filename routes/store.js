var express = require('express');
var router = express.Router();
var { getAllStoreItems } = require('../model/query/store');

router.get('/', function(req, res, next) {
  res.render('store');
});

router.get('/all', async function(req, res) {
    const items = await getAllStoreItems();
    res.send(items)
})

module.exports = router;