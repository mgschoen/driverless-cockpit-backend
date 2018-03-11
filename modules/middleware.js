function Middleware (mainControllerInstance) {

    this.mainController = mainControllerInstance;

    this.appState = (req, res) => {
        res.json(this.mainController.state);
    };

    this.startRecording = (req, res) => {
        if (this.mainController.startRecording()) {
            res.json(this.mainController.state);
        } else {
            res.statusCode = 500;
            res.send('Cannot start recording. Recording already active.');
        }
    };

    this.stopRecording = (req, res) => {
        if (this.mainController.stopRecording()) {
            res.json(this.mainController.state);
        } else {
            res.statusCode = 500;
            res.send('Cannot stop recording. No recording active.');
        }
    };

    this.liveStats = (req, res) => {
        let chunk = this.mainController.chunk;
        let jsonResponse = {
            timestamp: this.mainController.timestamp
        };
        for (let key in chunk) {
            jsonResponse[key] = chunk[key];
        }
        res.json(jsonResponse);
    };

    this.statsSince = (req, res) => {
        let timeframe = req.params.timeframe,
            parsedTimeframe, error;
        parsedTimeframe = parseInt(timeframe);
        if (isNaN(parsedTimeframe)) {
            error = new Error('Invalid request /statssince/'+timeframe+'. Failed to parse timeframe.');
            console.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json({respond: 'with all timeframes newer than '+parsedTimeframe});
        }
    };
}

module.exports = Middleware;