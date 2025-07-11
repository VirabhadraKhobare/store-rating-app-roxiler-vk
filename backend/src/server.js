const app = require('./app');
const config = require('./config/config');
const { testConnection } = require('./config/database');

// Test database connection on startup
const testDatabaseConnection = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed - exiting');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    await testDatabaseConnection();
    
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API Base URL: http://localhost:${config.port}/api`);
      console.log('📋 Available endpoints:');
      console.log('  - POST /api/auth/register');
      console.log('  - POST /api/auth/login');
      console.log('  - GET  /api/auth/profile');
      console.log('  - PUT  /api/auth/password');
      console.log('  - POST /api/auth/logout');
      console.log('  - GET  /api/auth/verify');
      console.log('  - GET  /api/health');
    });

    // Graceful shutdown handlers
    const gracefulShutdown = (signal) => {
      console.log(`\n📞 Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        try {
          const { shutdown } = require('./config/database');
          await shutdown();
          console.log('✅ Server shut down successfully');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();