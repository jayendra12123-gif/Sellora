const path = require('path');

const loadEnv = () => {
  const envPath = path.resolve(__dirname, '..', '.env');
  require('dotenv').config({ path: envPath });
};

module.exports = { loadEnv };
