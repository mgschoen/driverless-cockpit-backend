const StorageController = require('./storage-controller.js');
const VehicleConnector = require('./vehicle-connector.js');

function MainController () {

    // Private
    let storage = new StorageController();
    let vehicleConnector = new VehicleConnector(this);

    // Public
    this.state = {
        activeRecording: null,
        connected: true, // TODO: set this to false once there is a real connection to a UDP client
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
                this.state.recording = false;
                storage.dumpUnpersistedFrames(true);
                storage.finishRecording(this.state.activeRecording.id)
                    .then((result) => {
                        this.state.activeRecording = null;
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

    /**
     * Combines metadata and timeframes for a specific recording to a clip dataset
     * and returns it. Only works with finished recordings.
     * @param id - id of requested clip
     * @returns {Promise} - resolved with the requested clip if successful, rejected otherwise
     */
    this.composeClip = (id) => {
        return new Promise((resolve, reject) => {
            storage.getRecording(id).then((recResponse) => {
                if (recResponse.writeActive) {
                    reject(new Error('Recording with id '+id+' is still active. ' +
                        'Use GET /recording/since/:timeframe for querying active recordings.'));
                } else {
                    let clip = {
                        id: id,
                        start: recResponse.start,
                        end: recResponse.end
                    };
                    storage.getIntervalUncached(recResponse.start, recResponse.end)
                        .then((framesResponse) => {
                            clip.frames = framesResponse;
                            resolve(clip);
                        }, (error) => {
                            reject(error);
                        });
                }
            }, (error) => {
                reject(error);
            });
        });
    };

    /**
     * Returns a clip dataset similar to MainController.composeClip that contains
     * all timeframes newer than `since`. Uses storage internal cache for high
     * performance queries. Only works with active recording.
     * @param since - the last timeframe that should not be included in the response
     * @returns {Promise} - resolved with the requested clip if successful, rejected otherwise
     */
    this.composeActiveClip = (since) => {
        return new Promise((resolve, reject) => {
            if (this.state.recording) {
                let clipStart = (!since || since <= this.state.activeRecording.start)
                    ? this.state.activeRecording.start
                    : since;
                storage.getIntervalCached(clipStart, new Date().getTime())
                    .then(response => {
                        let clip = {
                            id: this.state.activeRecording.id,
                            start: this.state.activeRecording.start,
                            chunk: {
                                first: response[0].timestamp,
                                last: response.slice(-1)[0].timestamp
                            },
                            frames: response
                        };
                        resolve(clip);
                    }, error => {
                        reject(error);
                    });
            } else {
                reject(new Error('No recording active'));
            }
        });
    };

    /**
     * Requests a list of all recordings and returns them in a Promise
     * @returns {Promise}
     */
    this.getRecordingList = () => {
        return new Promise((resolve, reject) => {
            storage.getRecordings().then(response => {
                // newest first
                response.sort((a,b) => {
                    return b.start - a.start;
                });
                resolve(response);
            }, error => {
                reject(error);
            });
        });
    };

}

module.exports = MainController;