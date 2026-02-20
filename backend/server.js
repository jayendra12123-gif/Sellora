const { loadEnv } = require('./config/env');
loadEnv();

const { PORT } = require('./config/constants');
const { connectDB } = require('./db');
const { createApp } = require('./app');
const { ensureAdminUser } = require('./services/adminBootstrap');

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminUser();

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
