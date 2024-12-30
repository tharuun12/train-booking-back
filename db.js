require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'avnadmin',
  host: 'pg-1986e413-tharuuncloud-2c82.g.aivencloud.com',
  database: 'ticket',
  password: process.env.PG_PWD,  // Access the password from the environment variable
  port: 25582,
  ssl: {
    rejectUnauthorized: true, // Ensure SSL is enforced
    ca: fs.readFileSync(path.join(__dirname, 'ca.pem')) // Provide the path to the CA certificate
  }
});

module.exports = pool;
