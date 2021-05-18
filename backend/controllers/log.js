const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');
const logModel = mongoose.model('log');

const getAllDataByDeployment = (req, res) => {
}
const getSpeceficDataByDeployment = (req, res) => {
}
const getLastnNyDeployment = (req, res) => {
}


module.exports = {
    getAllDataByDeployment,
    getSpeceficDataByDeployment,
    getLastnNyDeployment
};