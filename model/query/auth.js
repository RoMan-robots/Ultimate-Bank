const { pool } = require('../db');
const { hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(name, email, password) {
    let client;
    try {
        client = await pool.connect();
        
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return null;
        }

        const loginCheck = await client.query('SELECT * FROM users WHERE login = $1', [name]);
        if (loginCheck.rows.length > 0) {
            return null;
        }

        const hashedPassword = hashSync(password, 10);
        const insertQuery = `INSERT INTO users (login, email, password, balance) VALUES (${name}, ${email}, ${hashedPassword}, 0)`;
        const result = await client.query(insertQuery, [name, email, hashedPassword]);
        
        const token = jwt.sign({ user: result.rows[0] }, process.env.JWT_SECRET);
        return token;
    } catch (error) {
        console.error('Registration error:', error);
        return null;
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function loginUser(email, password) {
    // Implement login logic
}

module.exports = { registerUser, loginUser };