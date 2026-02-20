const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', routes);

  app.use('/api', (req, res) => {
    res.status(404).json({
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
