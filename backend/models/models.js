var mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    location: {type: [Number], required: true, index: '2dsphere'},
    fftValues: [Number],
    decibels: Number,
    measured_at: { type : Date, default: Date.now },
});

const dataSchema = new mongoose.Schema({
    sensor: {type: mongoose.Types.ObjectId, required: true},
    deployment: {type: mongoose.Types.ObjectId, required: true},
    location: {type: [Number], required: true, index: '2dsphere'},
    size: Number,
    first: Date,
    last: Date,
    data: [measurementSchema]
});

const sensorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    mac: {type: [Number], required: true},
    deployments: [mongoose.Types.ObjectId],
    current_deployment: mongoose.Types.ObjectId,
    current_location: {type:[Number], index: '2dsphere'},
    last_telemetry: Date,
    last_data: mongoose.Types.ObjectId,
    all_data: [mongoose.Types.ObjectId],
    firmware_version: String,
    battery_voltage: Number
});


const gatewaySchema = new mongoose.Schema({
    name: {type: String, required: true},
    mac: {type: [Number], required: true},
    deployments: [mongoose.Types.ObjectId],
    current_deployment: mongoose.Types.ObjectId,
    wifi_credentials: [String],
    current_location: [Number],
    last_telemetry: Date,
    firmware_version: String
});

const dataDeploymentSchema = new mongoose.Schema({
    sensor_id: {type: mongoose.Types.ObjectId, required: true},
    location: {type: [Number], required: true, index: '2dsphere'},
    delivered: {Type: Boolean, default: false},
    mac: {type: [Number], required: true}
});



const deploymentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    sensors: [dataDeploymentSchema],
    gateways: [dataDeploymentSchema],
    status: {type: String, default: 'pending'},
    start: Date,
    finish: Date,
    measurement_num: Number,
    tags: [String]
});

mongoose.model('measurement', measurementSchema, 'measurement');
mongoose.model('data', dataSchema, 'data');
mongoose.model('sensor', sensorSchema, 'sensor');
mongoose.model('gateway', gatewaySchema, 'gateway');
mongoose.model('deploymentData', dataDeploymentSchema, 'deploymentData');
mongoose.model('deployment', deploymentSchema, 'deployment');
