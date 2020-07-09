const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');


/*
Returns partial data about all the gateways
 */
const getAllGateway = (req, res) => {}

/*
Returns all the information about a gateway with a specified id
 */
const getAllByIdGateway = (req, res) => {}

/*
Creates a new gateway, this is the same method as the one used in sensor where it only gets the mac address and then either returns useful information or creates a new gateway.
 */
const postGateway = (req, res) => {}

/*
Posts gateway telemetry to the server 
 */
const postTelemetryGateway = (req, res) => {}





module.exports = {
    getAllGateway,
    getAllByIdGateway,
    postGateway,
    postTelemetryGateway
};