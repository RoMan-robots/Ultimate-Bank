const { pool } = require('../db');

async function buyGoldenWallet(userId) {
    let client; 
    try {   
        client = await pool.connect();  

        const userCheck = await client.query('SELECT is_golden, balance FROM users WHERE id = $1', [userId]);
        const user = userCheck.rows[0];

        if (user.is_golden) {
            throw new Error('Ви вже маєте Golden Wallet');
        }

        if (user.balance < 400) {
            throw new Error('Недостатньо грошей для покупки Golden Wallet');
        }

        await client.query('UPDATE users SET balance = balance - 400 WHERE id = $1', [userId]);
        await client.query('UPDATE users SET is_golden = true WHERE id = $1', [userId]);  
        
        return { message: 'Успішна покупка Golden Wallet', type: 'success' };
    } catch (error) {
        console.error('Buy golden wallet error:', error);   
        throw error;
    } finally { 
        if (client) {
            client.release();
        }
    }
}

module.exports = { buyGoldenWallet };