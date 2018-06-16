const dgram = require('dgram');
const { parseMessage } = require('../util/schema-validator');
const { updateClusterList, updateTrajectory } = require('../util/list-updater');

// UDP server config
const PORT = '33333';

function VehicleConnector (distributorInstance) {

    this.distributor = distributorInstance;

    this.state = {
        vehicleX: 0,
        vehicleY: 0,
        vehicleRotation: 0,
        steerAngle: 0,
        pathMiddleX: 0,
        pathMiddleY: 0,
        vehicleVelocityX: 0,
        vehicleVelocityY: 0,
        vehicleAccelerationX: 0,
        vehicleAccelerationY: 0,
        observations: [],
        clusters: {},
        trajectory: [],
        trajectoryHash: 0,
        trajectoryPrimitives: [],
        other: {}
    };
    this.connectionLossTimeout = null;

    this.resetStats = _ => {
        this.state = {
            vehicleX: 0,
            vehicleY: 0,
            vehicleRotation: 0,
            steerAngle: 0,
            pathMiddleX: 0,
            pathMiddleY: 0,
            vehicleVelocityX: 0,
            vehicleVelocityY: 0,
            vehicleAccelerationX: 0,
            vehicleAccelerationY: 0,
            observations: [],
            clusters: {},
            trajectory: [],
            trajectoryHash: 0,
            trajectoryPrimitives: [],
            other: {}
        };
      this.distributor.distribute({...this.state});
    };

    let updateState = message => {
        switch (message.schema) {
            case 'CLARA':
                this.state.vehicleX = message.content.vehicle.x;
                this.state.vehicleY = message.content.vehicle.y;
                this.state.vehicleRotation = message.content.vehicle.yaw;
                this.state.steerAngle = message.content.vehicle.steerAngle;
                this.state.vehicleVelocityX = message.content.vehicle.vehicleVelocityX;
                this.state.vehicleVelocityY = message.content.vehicle.vehicleVelocityY;
                this.state.vehicleAccelerationX = message.content.vehicle.vehicleAccelerationX;
                this.state.vehicleAccelerationY = message.content.vehicle.vehicleAccelerationY;
                this.state.observations = message.content.observations;
                this.state.clusters = updateClusterList(this.state.clusters, message.content.clusters);
                break;
          case 'TRAJECTORY':
                let update = updateTrajectory(this.state.trajectory, message.content.trajectory);
                this.state.trajectory = update.points;
                this.state.trajectoryHash = update.hash;
                this.state.trajectoryPrimitives = message.content.primitives;
                break;
            default:
                this.state.other = {...this.state.other, ...message.content};
        }
        // shallow copying the state to make sure a new reference is passed
        // to the storage each time (it will reject storing otherwise)
        this.distributor.distribute({...this.state});
    };

    let connectionLost = _ => {
        this.distributor.state.connected = false;
        this.connectionLossTimeout = null;
    }

    // Setup udp server
    this.server = dgram.createSocket('udp4');
    this.server.on('listening', () => {
        let address = this.server.address();
        console.log('UDP server listening on ' + address.address + ':' + address.port);
    });

    // Listen for messages
    this.server.on('message', (payload, client) => {
        clearTimeout(this.connectionLossTimeout);
        this.distributor.state.connected = true;
        let string = String.fromCharCode.apply(null, payload);
        try {
            let message = parseMessage(string);
            updateState(message);
            // if we don't receive anything for 3 seconds we assume connection is lost
            this.connectionLossTimeout = setTimeout(connectionLost, 3000);
        } catch (e) {
            console.error(e.message);
        }
    });
    this.server.bind(PORT);
}

module.exports = VehicleConnector;