const mysql = require("mysql");
const util = require("util");
const dotenv = require("dotenv");
dotenv.config();


const pool = mysql.createPool({
    connectionLimit: 1000,
    host: process.env.DB_HOST,        // Now using DB_HOST
    user: process.env.DB_USER,        // Now using DB_USER
    password: process.env.DB_PASSWORD,// Now using DB_PASSWORD
    database: process.env.DATABASE    // This remains the same (or you can rename it too for consistency)
});

pool.getConnection((error, connection) => {
    if (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    } else {
        console.log("Connected to database successfully.");
        connection.release();
    }
});

// Promisify pool.query for async/await support
pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool;
