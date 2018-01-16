class StateHolder {

    constructor () {
        this.connected = false;
        this.recording = false;
    }

    get state () {
        return {
            connected: this.connected,
            recording: this.recording
        };
    }

}

module.exports = StateHolder;