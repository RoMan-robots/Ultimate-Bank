var express = require('express');
var router = express.Router();
var { getAllStoreItems, buyStoreItem } = require('../model/query/store');

router.get('/', function(req, res, next) {
  res.render('store');
});

router.get('/all', async function(req, res) {
    const items = await getAllStoreItems();
    res.send(items)
})

router.post('/buy', async function(req, res) {
    const { itemId, userId } = req.body;
    const item = await buyStoreItem(userId, itemId);
    res.send(item);
})

module.exports = router;