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

    this.recording = (req, res) => {
        mainController.composeClip(req.params.id).then((result) => {
            res.json(result);
        }, (error) => {
            res.statusCode = 500;
            res.send(error.message);
        });
    };

    this.recordingSince = (req, res) => {
        res.json({respond: 'with all timeframes of '+req.params.id+' since '+req.params.timeframe});
    }
}

module.exports = Middleware;