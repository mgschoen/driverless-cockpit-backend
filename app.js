// Libraries
const express = require('express');
const path = require('path');

// Load modules
const middleware = require('./modules/middleware.js');

// Module instances
const app = express();
const API = new middleware();

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