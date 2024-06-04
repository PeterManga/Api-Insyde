const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config();

mongoose.Promise = global.Promise;

const url = process.env.URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = app;
