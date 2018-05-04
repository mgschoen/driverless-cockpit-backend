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

    this.resetStats = (req, res) => {
        console.log('Resetting stats');
        mainController.resetStats();
        res.send('Success')
    };

    this.getRecording = (req, res) => {
        mainController.composeClip(req.params.id).then((result) => {
            res.json(result);
        }, (error) => {
            res.statusCode = 500;
            res.send(error.message);
        });
    };

    this.getActiveRecording = (req, res) => {
        console.time('recording-since-'+req.params.since);
        mainController.composeActiveClip(req.params.since)
            .then(result => {
                console.timeEnd('recording-since-'+req.params.since);
                res.json(result);
            }, error => {
                console.timeEnd('recording-since-'+req.params.since);
                res.statusCode = 500;
                res.send(error.message);
            });
    };

    this.allRecordings = (req, res) => {
        mainController.getRecordingList().then(response => {
            res.json(response);
        }, error => {
            res.statusCode = 500;
            res.send(error.message);
        });
    };
}

module.exports = Middleware;