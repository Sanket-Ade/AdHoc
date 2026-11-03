const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDb() {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'adhoc_db';

    console.log(`Connecting to MySQL server at ${host}:${port} as ${user}...`);

    let connection;
    try {
        // First connection without selecting database
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            multipleStatements: true,
        });

        console.log('Connected to MySQL server.');

        // Create Database if it doesn't exist
        console.log(`Creating database "${database}" if it does not exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`Database "${database}" ready.`);

        // Switch to the database
        await connection.query(`USE \`${database}\`;`);

        // Read and execute schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing database schema definitions...');
        await connection.query(schemaSql);

        console.log('All database tables created successfully!');
        console.log('Next step: Run "npm run db:seed" to populate initial data.');
    } catch (error) {
        console.error('\nDatabase initialization failed:');
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('>> Access Denied: Please check DB_USER and DB_PASSWORD in your server/.env file.');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('>> Connection Refused: Make sure MySQL is running on port ' + port + '.');
        } else {
            console.error(error.message);
        }
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initDb();
