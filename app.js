// Libraries
const express = require('express');
const path = require('path');

// Load modules
const middleware = require('./modules/middleware');
const vehicleConnector = require('./modules/vehicle-connector');
const distributor = require('./modules/distributor');
const StorageController = require('./modules/storage-controller');

// Module instances
const app = express();
const storage = new StorageController();
const dist = new distributor(storage);
const API = new middleware(dist, storage);
const vehicle = new vehicleConnector(dist);

// Static server
app.use('/', express.static(path.join(__dirname, 'static')));

// API routes
app.get('/appstate', API.appState);
app.get('/startrecording', API.startRecording);
app.get('/stoprecording', API.stopRecording);
app.get('/livestats', API.liveStats);
app.get('/statssince/:timeframe', API.statsSince);

// Start listening
app.listen(3000, () => console.log('Server listening on port 3000'));