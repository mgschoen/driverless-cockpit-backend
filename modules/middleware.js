function Middleware (mainControllerInstance) {

    let mainController = mainControllerInstance;

    this.appState = (req, res) => {
        res.json(mainController.state);
    };

    this.startRecording = (req, res) => {
        mainController.startRecording().then(_ => {
            res.json(mainController.state);
        }, (error) => {
            res.statusCode = 500;
            res.send(error.message);
        });
    };

    this.stopRecording = (req, res) => {
        mainController.stopRecording().then(_ => {
            res.json(mainController.state);
        }, (error) => {
            res.statusCode = 500;
            res.send(error.message);
        });
    };

    this.liveStats = (req, res) => {
        let chunk = mainController.chunk;
        let jsonResponse = {
            timestamp: mainController.timestamp
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