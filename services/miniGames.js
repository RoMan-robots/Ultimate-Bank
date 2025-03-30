const { rewardUser } = require('../model/query/miniGames');

const reward = async (req, res) => {
    const score = req.body.score;
    const { user } = req.body;
    await rewardUser(score, user.id);
    res.status(200).json({ success: true });
};

module.exports = { reward };