const dgram = require('dgram');
const parseMessage = require('../util/schema-validator').parseMessage;

// Deprecated
const VehicleMock = require('./vehicle-mock.js');

// UDP server config
const PORT = '33333';

function VehicleConnector (distributorInstance) {

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

    // Setup udp server
    this.server = dgram.createSocket('udp4');
    this.server.on('listening', () => {
        let address = this.server.address();
        console.log('UDP server listening on ' + address.address + ':' + address.port);
    });


    this.server.on('message', (payload, client) => {
        let string = String.fromCharCode.apply(null, payload);
        try {
            let array = parseMessage(string);
            console.log(array);
            console.log(client);
        } catch (e) {
            console.error(e.message);
        }
    });
    this.server.bind(PORT);

    /* if (process.env.FSD_MOCKDATA_PATH) {
        this.vehicle = new VehicleMock(process.env.FSD_MOCKDATA_PATH);
        this.vehicle.on('chunk', this.broadcastChunk);
    } else {
        throw new Error('Please specify source path to vehicle mock data in ' +
            'FSD_MOCKDATA_PATH environment variable');
    }*/

}

module.exports = VehicleConnector;