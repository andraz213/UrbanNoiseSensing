const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');

const getAllSensor = (req, res) => {}
const getAllByIdSensor = (req, res) => {}
const postSensor = (req, res) => {}
const postTelemetrySensor = (req, res) => {}
const postDataSensorSensor = (req, res) => {}





module.exports = {
    getAllSensor,
    getAllByIdSensor,
    postSensor,
    postTelemetrySensor,
    postDataSensorSensor
};