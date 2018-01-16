const VehicleMock = require('./vehicle-mock.js');

function VehicleConnector (stateHolderInstance, distributorInstance) {

    this.stateHolder = stateHolderInstance;
    this.distributor = distributorInstance;

    this.broadcastChunk = () => {
        let chunk = {
            steerAngle: this.vehicle.steerAngle,
            pathMiddleX: this.vehicle.pathMiddleX,
            pathMiddleY: this.vehicle.pathMiddleY,
            vehicleX: this.vehicle.vehicleX,
            vehicleY: this.vehicle.vehicleY,
            vehicleVelocityX: this.vehicle.vehicleVelocityX,
            vehicleVelocityY: this.vehicle.vehicleVelocityY,
            vehicleRotation: this.vehicle.vehicleRotation,
            frontwheelLeftRotation: this.vehicle.frontwheelLeftRotation,
            frontwheelRightRotation: this.vehicle.frontwheelRightRotation
        };
        this.distributor.distribute(chunk);
    };

    if (process.env.FSD_MOCKDATA_PATH) {
        this.vehicle = new VehicleMock(process.env.FSD_MOCKDATA_PATH);
        this.vehicle.on('chunk', this.broadcastChunk);
    } else {
        throw new Error('Please specify source path to vehicle mock data in ' +
            'FSD_MOCKDATA_PATH environment variable');
    }

}

module.exports = VehicleConnector;