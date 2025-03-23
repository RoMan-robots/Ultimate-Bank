var express = require('express');
var { buyGoldenWallet } = require('../model/query/goldenWallet');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('goldenWallet');
});

router.post('/', async function(req, res) {
  const { user } = req.body;
  const userId = user.id;

  if (user.is_golden) {
      return res.status(400).json({ error: 'Ви вже маєте Golden Wallet' });
  }

  try {
      await buyGoldenWallet(userId);
      res.status(200).json({ success: true });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

module.exports = router;