const { Pool } = require('pg');
require('dotenv').config('../.env');
const fs = require('fs');

const rawConfig = fs.readFileSync('database.json');
const config = JSON.parse(rawConfig);

const dbConfig = {
    ...config.dev,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10,
};

const pool = new Pool(dbConfig);

module.exports = { pool };