const StorageController = require('./storage-controller.js');
const VehicleConnector = require('./vehicle-connector.js');

function MainController () {

    // Private
    let storage = new StorageController();
    let vehicleConnector = new VehicleConnector(this);

    // Public
    this.state = {
        activeRecording: null,
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
     * @returns {Promise} - resolved when started successfully, rejected otherwise
     */
    this.startRecording = _ => {
        return new Promise ((resolve, reject) => {
            if (!this.state.recording) {
                storage.createRecording().then((result) => {
                    this.state.activeRecording = result;
                    this.state.recording = true;
                    resolve();
                }, (error) => {
                    console.warn(error);
                    reject(error);
                });
            } else {
                reject(new Error('Cannot start recording. Recording already active.'));
            }
        });
    };

    /**
     * Stop recording and finish recorded clip
     * @returns {Promise} - resolved when stopped successfully, rejected otherwise
     */
    this.stopRecording = _ => {
        return new Promise((resolve, reject) => {
            if (this.state.recording) {
                storage.finishRecording(this.state.activeRecording)
                    .then((result) => {
                        this.state.recording = false;
                        this.state.activeRecording = null;
                        storage.dumpUnpersistedFrames(true);
                        resolve();
                    }, (error) => {
                        console.warn(error);
                        reject(error);
                    });
            } else {
                reject(new Error('Cannot stop recording. No recording active.'));
            }
        });
    };

}

module.exports = MainController;