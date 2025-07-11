const { Pool } = require('pg');
const config = require('./config');

// Create connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  ssl: config.database.ssl,
  max: config.database.max,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.connectionTimeoutMillis,
});

// Event listeners for connection monitoring
pool.on('connect', (client) => {
  console.log('🔗 New database connection established');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

pool.on('remove', (client) => {
  console.log('🔌 Database connection removed');
});

// Function to test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful');
    console.log('📅 Current database time:', result.rows[0].current_time);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Function to execute queries with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (config.nodeEnv === 'development') {
      console.log('📊 Query executed:', {
        duration: `${duration}ms`,
        rows: result.rowCount,
        command: text.split(' ')[0]
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Function to get a client from the pool
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('❌ Error getting database client:', error);
    throw error;
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('🛑 Shutting down database connections...');
  await pool.end();
  console.log('✅ Database connections closed');
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  shutdown
};