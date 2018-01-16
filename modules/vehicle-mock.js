const EventEmitter = require('events');
const fs = require('fs');
const readline = require('n-readlines');

class VehicleMock extends EventEmitter {

    constructor (sourcePath) {

        super();

        if (sourcePath) {
            this.sourcePath = sourcePath;
        } else {
            throw new Error('No source path defined');
        }

        this.steerAngle = 0;
        this.pathMiddleX = 0;
        this.pathMiddleY = 0;
        this.vehicleX = 0;
        this.vehicleY = 0;
        this.vehicleVelocityX = 0;
        this.vehicleVelocityY = 0;
        this.vehicleRotation = 0;
        this.frontwheelLeftRotation = 0;
        this.frontwheelRightRotation = 0;

        try {
            this.lineReader = new readline(this.sourcePath);
        } catch (e) {
            throw new Error(e.message);
        }

        this.nextLine();
    }

    nextLine () {
        let lr = this.lineReader;
        var line = lr.next();
        if (lr.linesCache.length === 1 && lr.eofReached) {
            lr.reset();
        }
        let dataArray = line.toString('ascii').split(',');
        this.steerAngle = parseFloat(dataArray[1]);
        this.pathMiddleX = parseFloat(dataArray[2]);
        this.pathMiddleY = parseFloat(dataArray[3]);
        this.vehicleX = parseFloat(dataArray[4]);
        this.vehicleY = parseFloat(dataArray[5]);
        this.vehicleVelocityX = parseFloat(dataArray[6]);
        this.vehicleVelocityY = parseFloat(dataArray[7]);
        this.vehicleRotation = parseFloat(dataArray[8]);
        this.frontwheelLeftRotation = parseFloat(dataArray[9]);
        this.frontwheelRightRotation = parseFloat(dataArray[10]);
        this.emit('chunk');
        setTimeout(() => {
            this.nextLine();
        }, 100);
    }

    printStatus () {
        console.log('steerAngle='+this.steerAngle+' pathMiddleX='+this.pathMiddleX+
            ' pathMiddleY='+this.pathMiddleY+' vehicleX='+this.vehicleX+
            ' vehicleY='+this.vehicleY);
    }
}

module.exports = VehicleMock;