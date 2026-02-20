const express = require('express');
const app = express();
const port = 3000;
const mongoDB = require("./db");
const path = require('path');

global.itemData = [];
global.foodCategory = [];

mongoDB(function(err, data, catData) {
    if (err) {
        console.log(err);
    } else {
        global.itemData = data;
        global.foodCategory = catData;
        console.log("Data loaded successfully!");
    }
});

app.use((req, res, next) => { 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../dist')));

app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Handle all other routes by serving index.html (for React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});