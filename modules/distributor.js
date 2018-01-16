class Switch {

    constructor (stateHandlerInstance) {
        this.stateHandler = stateHandlerInstance;
    }

    distribute (chunk) {
        let timestamp = new Date().getTime();
        this.timestamp = timestamp;
        this.chunk = chunk;
        let timeframe = {
            timestamp: timestamp,
            chunk: chunk
        };
        if (this.stateHandler.recording) {
            // TODO: persist in Cache and DB
            console.log(timeframe);
        }
    }

}

module.exports = Switch;