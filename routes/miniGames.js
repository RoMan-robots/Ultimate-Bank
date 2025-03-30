const express = require('express');
const router = express.Router();
const { reward } = require('../services/miniGames');

router.get('/', (req, res) => {
    res.render('miniGames');
});

router.post('/reward', reward);

module.exports = router;