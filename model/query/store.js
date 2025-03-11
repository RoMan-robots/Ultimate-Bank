const { pool } = require('../db');

async function getAllStoreItems() {
    return runQuery('SELECT * FROM store_items');
}

async function getStoreItemById(id) {
    return runQuery('SELECT * FROM store_items WHERE id = $1', [id]);
}

async function buyStoreItem(userId, itemId) {
    console.log(userId, itemId, new Date());
    return runQuery('INSERT INTO purchases (customer, bought_item, date) VALUES ($1, $2, $3)', [userId, itemId, new Date()]);
}

async function runQuery(query, params) {
    let client;
    try {
        client = await pool.connect();
        
        const result = await client.query(query, params);
        
        return result.rows;
    } catch (error) {
        console.error('Run query error:', error);
        return [];
    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = { getAllStoreItems, getStoreItemById, buyStoreItem };