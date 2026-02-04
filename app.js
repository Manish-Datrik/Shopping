const express = require("express");
const app = express();
const pool = require('./schema');
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Test database connection
pool.getConnection().then(connection => {
    console.log(" Database connected successfully!");
    connection.release();
}).catch(err => {
    console.error(" Database connection failed:", err);
});

app.use((req, res, next) => {
    console.log("Incoming request: " + req.method + " " + req.path);
    next();
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint to add item to cart
app.post("/api/cart", async (req, res) => {
    const { product_id, quantity, user_id, product_name, price } = req.body;

    if (!product_id || !quantity || !user_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const connection = await pool.getConnection();
        
        // Insert cart item into database
        const query = "INSERT INTO cart (user_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)";
        const result = await connection.execute(query, [user_id, product_id, product_name, price, quantity]);
        
        connection.release();
        
        res.json({ success: true, message: "Item added to cart", cartId: result[0].insertId });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to add item to cart", details: error.message });
    }
});

// Get cart items for a user (query param: user_id)
app.get('/api/cart', async (req, res) => {
    const userId = req.query.user_id || 1;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
        connection.release();
        res.json({ success: true, items: rows });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
    }
});
// Delete cart item by id
app.delete('/api/cart/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM cart WHERE id = ?', [id]);
        connection.release();
        res.json({ success: true });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to delete cart item', details: err.message });
    }
});

// Cart page route (server-rendered)
app.get('/cart', async (req, res) => {
    const userId = req.query.user_id || 1;
    try {
        const connection = await pool.getConnection();
        const [items] = await connection.execute('SELECT id, product_id, product_name, price, quantity FROM cart WHERE user_id = ?', [userId]);
        connection.release();
        // render server-side to keep client simple
        res.render('cart', { items });
    } catch (err) {
        console.error('DB error loading cart page:', err);
        res.status(500).send('Unable to load cart');
    }
});

// Simple form endpoint to remove item (POST)
app.post('/cart/remove', async (req, res) => {
    const id = req.body.id;
    try {
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM cart WHERE id = ?', [id]);
        connection.release();
        res.redirect('/cart');
    } catch (err) {
        console.error('DB error deleting cart item:', err);
        res.status(500).send('Delete failed');
    }
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});