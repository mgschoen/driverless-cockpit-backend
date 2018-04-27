// Libraries
const express = require('express');
const path = require('path');
const minimist = require('minimist');

// Load modules
const Middleware = require('./modules/middleware');
const MainController = require('./modules/main-controller');

// Module instances
const app = express();
const mainController = new MainController();
const API = new Middleware(mainController);

// Command line arguments
let args = minimist(process.argv.slice(2));

// Enable CORS if flag was set
if (args.cors || args.c) {
    console.info('Enabling CORS. Warning: This feature should only be used in development environments.');
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
}

// Static server
app.use('/', express.static(path.join(__dirname, 'static')));

// API routes
app.get('/appstate', API.appState);
app.get('/livestats', API.liveStats);
app.get('/recording/start', API.startRecording);             // start a new recording
app.get('/recording/active/:since', API.getActiveRecording); // get all frames newer than :since (active recordings only)
app.get('/recording/stop', API.stopRecording);               // stop active recording
app.get('/recording/:id', API.getRecording);                 // get a complete recording (finished recordings only)
app.get('/recordings', API.allRecordings);                   // get a list of all recordings

// Start listening
app.listen(3000, () => console.log('HTTP server listening on port 3000'));