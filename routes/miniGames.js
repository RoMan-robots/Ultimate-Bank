const express = require('express');
const router = express.Router();
const { reward } = require('../model/query/miniGames');

router.get('/', (req, res) => {
    res.render('miniGames');
});

router.post('/reward/:score', async (req, res) => {
    const score = req.params.score;
    await reward(score);
    res.status(200).json({ success: true });
});

module.exports = router;