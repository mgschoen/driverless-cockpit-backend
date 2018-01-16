function Middleware (stateHolderInstance, distributorInstance) {

    this.stateHolder = stateHolderInstance;
    this.distributor = distributorInstance;

    this.appState = (req, res) => {
        res.json(this.stateHolder.state);
    };

    this.startRecording = (req, res) => {
        this.stateHolder.recording = true;
        res.json(this.stateHolder.state);
    };

    this.stopRecording = (req, res) => {
        this.stateHolder.recording = false;
        res.json(this.stateHolder.state);
    };

    this.liveStats = (req, res) => {
        let chunk = this.distributor.chunk;
        let jsonResponse = {
            timestamp: this.distributor.timestamp
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