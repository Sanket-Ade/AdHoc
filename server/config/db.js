const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adhoc_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    dateStrings: true,
};

const pool = mysql.createPool(dbConfig);

// Helper query function
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database Query Error:', error.message, '\nSQL:', sql);
        throw error;
    }
};

// Test connection function
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`Connected to MySQL database "${dbConfig.database}" at ${dbConfig.host}:${dbConfig.port}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('MySQL connection failed:', error.message);
        return false;
    }
};

module.exports = {
    pool,
    query,
    testConnection,
};
