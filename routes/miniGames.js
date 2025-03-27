const express = require('express');
const router = express.Router();
const { reward } = require('../model/query/miniGames');

router.get('/', (req, res) => {
    res.render('miniGames');
});

router.post('/reward', async (req, res) => {
    const score = req.body.score;
    const { user } = req.body;
    await reward(score, user.id);
    res.status(200).json({ success: true });
});

module.exports = router;