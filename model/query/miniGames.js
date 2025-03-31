const { pool } = require('../../db');

async function rewardUser(score, userId) {
    let client;
    try {
        client = await pool.connect();
        const insertQuery = `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *`;
        const result = await client.query(insertQuery, [score, userId]);
        return result.rows[0];
    } catch (error) {
        console.error('Reward error:', error);
        return null;
    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = { rewardUser }
