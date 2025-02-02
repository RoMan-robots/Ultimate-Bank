const { pool } = require('../db');
const { hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(name, email, password) {
    try {
        const client = await pool.connect();
        const user = await client.query(`SELECT * FROM users WHERE email = ${email}`);
        if (user.rows.length > 0) {
            return "This email already exists";
        }

        const userLogin = await client.query(`SELECT * FROM users WHERE login = ${name}`);
        if (userLogin.rows.length > 0) {
            return "This login already exists";
        }

        let query = `INSERT INTO users (login, email, password) VALUES (${name}, ${email}, ${hashSync(password, 10)})`;
        let result = await client.query(query);
        let token = jwt.sign({ user: result.rows[0] }, process.env.JWT_SECRET);
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
        return error;
    } finally {
        client.release();
    }
}

async function loginUser(email, password) {
}

module.exports = { registerUser, loginUser };