const { Pool } = require('pg');
require('dotenv').config('../.env');

const dbConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.SSL,
    },
    max: 10,
};

const pool = new Pool(dbConfig);

module.exports = { pool };