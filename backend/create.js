// create-registrations-table.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

// Use the same environment variables as your backend
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER || process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || process.env.DB_DATABASE,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// SQL for creating the registrations table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS "registrations" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar(100) NOT NULL,
  "email" varchar(100) NOT NULL,
  "phone" varchar(20) NOT NULL,
  "age" integer NOT NULL,
  "interestArea" varchar(50) NOT NULL,
  "preferredDates" date[] NOT NULL,
  "preferredTiming" varchar(20) NOT NULL,
  "expectations" text,
  "referralSource" varchar(50) NOT NULL,
  "paymentStatus" varchar DEFAULT 'pending',
  "paymentScreenshot" bytea,
  "emailSent" boolean DEFAULT false,
  "confirmationEmailSent" boolean DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Ensure the uuid-ossp extension is available for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
`;

async function createTable() {
  console.log('Connecting to database with config:', { 
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: '(hidden)',
    ssl: dbConfig.ssl ? 'enabled' : 'disabled'
  });

  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database successfully');
    
    console.log('Creating registrations table...');
    await client.query(createTableSQL);
    console.log('Table "registrations" created successfully');
    
    // Verify the table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'registrations'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ Verified: Table "registrations" exists in the database');
    } else {
      console.error('❌ Verification failed: Table was not created successfully');
    }
  } catch (error) {
    console.error('Error creating table:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createTable().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});