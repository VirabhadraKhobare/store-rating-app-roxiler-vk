const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('../src/config/config');

// Create database connection
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
});

// Function to execute SQL file
const executeSqlFile = async (filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log(`✅ Successfully executed: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error executing ${path.basename(filePath)}:`, error.message);
    throw error;
  }
};

// Function to test database connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful');
    console.log('📅 Current database time:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Function to check if tables exist
const checkTables = async () => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📋 Existing tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }
};

// Function to get database statistics
const getDatabaseStats = async () => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const storeCount = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await pool.query('SELECT COUNT(*) FROM ratings');
    
    console.log('📊 Database Statistics:');
    console.log(`  - Total Users: ${userCount.rows[0].count}`);
    console.log(`  - Total Stores: ${storeCount.rows[0].count}`);
    console.log(`  - Total Ratings: ${ratingCount.rows[0].count}`);
  } catch (error) {
    console.error('❌ Error getting database stats:', error.message);
  }
};

// Main setup function
const setupDatabase = async () => {
  console.log('🚀 Starting database setup...\n');
  
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Cannot connect to database');
    }
    
    console.log('\n📝 Setting up database schema...');
    
    // Execute schema file
    await executeSqlFile(path.join(__dirname, 'schema.sql'));
    
    console.log('\n🌱 Seeding initial data...');
    
    // Execute seed file
    await executeSqlFile(path.join(__dirname, 'seeds', '001_seed_initial_data.sql'));
    
    console.log('\n✅ Database setup completed successfully!');
    
    // Show final statistics
    await getDatabaseStats();
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Function to reset database (drop and recreate)
const resetDatabase = async () => {
  console.log('🔄 Resetting database...\n');
  
  try {
    await testConnection();
    
    // Drop all tables
    console.log('🗑️  Dropping existing tables...');
    await pool.query(`
      DROP TABLE IF EXISTS ratings CASCADE;
      DROP TABLE IF EXISTS stores CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP VIEW IF EXISTS store_ratings_summary CASCADE;
      DROP VIEW IF EXISTS user_statistics CASCADE;
    `);
    
    console.log('✅ Tables dropped successfully');
    
    // Recreate everything
    await setupDatabase();
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  }
};

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'reset':
    resetDatabase();
    break;
  case 'check':
    (async () => {
      await testConnection();
      await checkTables();
      await getDatabaseStats();
      await pool.end();
    })();
    break;
  default:
    console.log('📖 Usage:');
    console.log('  node database/setup.js setup  - Setup database schema and seed data');
    console.log('  node database/setup.js reset  - Reset database (drop and recreate)');
    console.log('  node database/setup.js check  - Check database status');
    process.exit(1);
}