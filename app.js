const express = require("express");
const app = express();
const pool = require('./schema');

// Test database connection
pool.getConnection().then(connection => {
    console.log("✓ Database connected successfully!");
    connection.release();
}).catch(err => {
    console.error("✗ Database connection failed:", err);
});

app.use((req, res, next) => {
    console.log("new incoming request");
    next();
});
app.set("view engine", "ejs");
const path = require("path");

app.set("views", path.join(__dirname, "/views"));


app.get("/", (req, res) => {
    res.render("home.ejs");
});
const port = 8080;

app.listen(port, () => {
    console. log(`listening on port ${port}`);
});