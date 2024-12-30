require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PWD,  // Access the password from the environment variable
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: true, // Ensure SSL is enforced
    ca: fs.readFileSync(process.env.PG_CA_CERT) // Provide the path to the CA certificate
  }
});

module.exports = pool;
