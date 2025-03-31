const { pool } = require('../../db');

async function getAllStoreItems() {
    return runQuery('SELECT * FROM store_items');
}

async function getStoreItemById(id) {
    return runQuery('SELECT * FROM store_items WHERE id = $1', [id]);
}

async function buyStoreItem(userId, itemId) {
    runQuery('UPDATE users SET balance = balance - (SELECT price FROM store_items WHERE id = $1) WHERE id = $2', [itemId, userId]);
    return runQuery('INSERT INTO purchases (customer, bought_item, date) VALUES ($1, $2, $3)', [userId, itemId, new Date()]);
}

async function hasUserItem(userId, itemId) {
    const result = await runQuery('SELECT * FROM purchases WHERE customer = $1 AND bought_item = $2', [userId, itemId]);
    return result.length > 0; 
}

async function getUserInventory(userId) {
    const result = await runQuery(`
        SELECT i.id, i.name, i.price, COUNT(p.bought_item) AS q
        FROM purchases p
        JOIN store_items i ON p.bought_item = i.id
        WHERE p.customer = $1
        GROUP BY i.id
    `, [userId]);

    return result;
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

module.exports = { getAllStoreItems, getStoreItemById, buyStoreItem, hasUserItem, getUserInventory };