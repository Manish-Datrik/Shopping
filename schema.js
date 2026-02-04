const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sneha@2021', // Add your password here if set
    database: 'shopping',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create tables
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create products table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create orders table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_name VARCHAR(100) NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('Database tables created successfully!');
        connection.release();
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

// Initialize database on start
initializeDatabase();

module.exports = pool;
