// Libraries
const express = require('express');
const path = require('path');

// Load modules
const middleware = require('./modules/middleware.js');
const stateHolder = require('./modules/state-holder.js');
const vehicleConnector = require('./modules/vehicle-connector.js');
const distributor = require('./modules/distributor.js');

// Module instances
const app = express();
const state = new stateHolder();
const dist = new distributor(state);
const API = new middleware(state, dist);
const vehicle = new vehicleConnector(state, dist);

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