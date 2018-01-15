class Middleware {

    constructor () {}

    appState (req, res) {
        res.json({respond: 'with app state'});
    }

    startRecording (req, res) {
        res.json({recording: true});
    }

    stopRecording (req, res) {
        res.json({recording: false});
    }

    liveStats (req, res) {
        res.json({respond: 'with a single timeframe'});
    }

    statsSince (req, res) {
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
    }
}

module.exports = Middleware;