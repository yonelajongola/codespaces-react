const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoDB = require('./db');

const app = express();
const basePath = process.env.NETLIFY ? '/.netlify/functions/api' : '/api';
const corsOrigin = process.env.CORS_ORIGIN || '*';

global.itemData = [];
global.foodCategory = [];

mongoDB(function (err, data, catData) {
  if (err) {
    console.log(err);
  } else {
    global.itemData = data;
    global.foodCategory = catData;
    console.log('Data loaded successfully!');
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());

if (!process.env.NETLIFY) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
}

app.use(basePath, require('./Routes/CreateUser'));
app.use(basePath, require('./Routes/DisplayData'));
app.use(basePath, require('./Routes/OrderData'));
app.use(basePath, require('./Routes/AIWaiterPublic'));

if (!process.env.NETLIFY) {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  // Handle all other routes by serving index.html (for React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

module.exports = app;
