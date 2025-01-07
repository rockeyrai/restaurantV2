const mysql = require('mysql2/promise'); // Ensure you are using the promise version
require('dotenv').config();

// MySQL Connection Pool
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,    // Wait for a connection to become available if none are free
  connectionLimit: 10,         // Max number of connections allowed in the pool
  queueLimit: 0,               // No limit on waiting requests
});

// Log connection pool status using async/await
const connectMySql = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    console.log('Connected to MySQL');
    connection.release(); // Always release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message || err);
  }
};


// Export the connection pool
module.exports = {connectMySql,mysqlPool};