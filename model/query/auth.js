const { pool } = require('../db');
const { hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(name, email, password) {
    let client;
    try {
        client = await pool.connect();
        
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return 'Цей email вже зайнятий';
        }

        const loginCheck = await client.query('SELECT * FROM users WHERE login = $1', [name]);
        if (loginCheck.rows.length > 0) {
            return 'Це ім\'я зайняте';
        }

        const hashedPassword = hashSync(password, 10);
        const insertQuery = `INSERT INTO users (login, email, password, balance) VALUES ($1, $2, $3, 0) RETURNING *`;
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
    let client;
    try {
        client = await pool.connect();
        
        const userCheck = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );


        if (userCheck.rows.length === 0) {
            return {message: 'Користувача не знайдено', type: 'error'};
        }

        const user = userCheck.rows[0];
        
        const isPasswordValid = compareSync(password, user.password);
        
        if (!isPasswordValid) {
            return {message: 'Невірний пароль', type: 'error'};
        }

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        return {message: 'Успішний вхід', token: token, type: 'success'};
    } catch (error) {
        console.error('Login error:', error);
        return {message: 'Внутрішня помилка сервера', type: 'error'};
    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = { registerUser, loginUser };