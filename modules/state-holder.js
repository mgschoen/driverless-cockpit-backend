function StateHolder () {

    this.connected = false;
    this.recording = false;

    this.getState = _ => {
        return {
            connected: this.connected,
            recording: this.recording
        };
    };
}

module.exports = new StateHolder();