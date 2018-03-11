const StorageController = require('./storage-controller.js');
const VehicleConnector = require('./vehicle-connector.js');

function MainController () {

    // Private
    let storage = new StorageController();
    let vehicleConnector = new VehicleConnector(this);

    // Public
    this.state = {
        connected: false,
        recording: false
    };

    this.distribute = (chunk) => {
        let timestamp = new Date().getTime();
        this.timestamp = timestamp;
        this.chunk = chunk;
        let timeframe = {
            timestamp: timestamp,
            chunk: chunk
        };
        if (this.state.recording) {
            storage.insert(timestamp, chunk);
        }
    };

    /**
     * Start recording frames to database
     * @returns {boolean} - true if started successfully, false if recording already active
     */
    this.startRecording = _ => {
        if (!this.state.recording) {
            this.state.recording = true;
            return true;
        } else {
            return false;
        }
    };

    /**
     * Stop recording and finish recorded clip
     * @returns {boolean} - true if finished successfully, false otherwise
     */
    this.stopRecording = _ => {
        if (this.state.recording) {
            this.state.recording = false;
            storage.dumpUnpersistedFrames(true);
            return true;
        } else {
            return false;
        }
    };

}

module.exports = MainController;