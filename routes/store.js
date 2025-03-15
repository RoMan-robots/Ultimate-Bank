var express = require('express');
var router = express.Router();
var { getAllStoreItems, buyStoreItem, getStoreItemById, hasUserItem } = require('../model/query/store');

router.get('/', function(req, res, next) {
  res.render('store');
});

router.get('/all', async function(req, res) {
    const items = await getAllStoreItems();
    res.send(items)
})

router.post('/buy', async function(req, res) {
  const { itemId, user } = req.body;
  const userId = user.id;

  const item = (await getStoreItemById(itemId))[0];
  console.log(user, item)
  if (!item) {
      return res.status(404).json({ error: 'Товар не знайдено' });
  }

  const ownsItem = await hasUserItem(userId, itemId);
  if (ownsItem) {
      return res.status(400).json({ error: 'Ви вже володієте цим товаром' });
  }

  if (item.is_golden && !user.is_golden) {
      return res.status(400).json({ error: 'Ви повинні мати Golden Wallet для покупки цього товару' });
  }

  if ((user.balance - item.price) < 0) {
    return res.status(400).json({ error: 'Недостатньо коштів для покупки цього товару' });
  }

  const result = await buyStoreItem(userId, itemId);
  res.send(JSON.stringify(result));
});

module.exports = router;