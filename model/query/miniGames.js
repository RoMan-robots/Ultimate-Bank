const { pool } = require('../db');

async function reward(score) {
    let client;
    try {
        client = await pool.connect();
        const insertQuery = `UPDATE users SET balance = balance + $1 WHERE id = 1 RETURNING *`;
        const result = await client.query(insertQuery, [score]);
        console.log(result.rows[0]);
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

module.exports = { reward }
