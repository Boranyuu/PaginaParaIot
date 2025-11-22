require('dotenv').config();

const config = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  PORT: process.env.PORT || 3000
};

module.exports = config;

