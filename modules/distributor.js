function Distributor (storageControllerInstance) {

    this.stateHandler = require('./state-holder');
    this.storage = storageControllerInstance;

    this.distribute = (chunk) => {
        let timestamp = new Date().getTime();
        this.timestamp = timestamp;
        this.chunk = chunk;
        let timeframe = {
            timestamp: timestamp,
            chunk: chunk
        };
        if (this.stateHandler.recording) {
            this.storage.insert(timestamp, chunk);
        }
    };

}

module.exports = Distributor;