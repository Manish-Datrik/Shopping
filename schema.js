const mysql = require('mysql2/promise');

// Database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sneha@2021',
    database: 'shopping',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Database connection pool created. Make sure "shopping" database exists in MySQL!');

module.exports = pool;


