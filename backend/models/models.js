var mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    frequencyRange: Number,
    fftValues: [Number],
    decibels: Number,
    measured_at: {type: Date, default: Date.now, index: true},
});

const dataSchema = new mongoose.Schema({
    sensor: {type: mongoose.Types.ObjectId, required: true, index: true},
    deployment: {type: mongoose.Types.ObjectId, required: true, index: true},
    location: {type: [Number], required: true, index: '2dsphere'},
    size: Number,
    first: {type: Date, default: Date.now},
    last: {type: Date, default: Date.now},
    data: [measurementSchema]
});

const sensorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    mac: {type: [Number], required: true, index: true},
    deployments: [mongoose.Types.ObjectId],
    current_deployment: {type: mongoose.Types.ObjectId, index: true},
    current_location: {type: [Number], index: '2dsphere'},
    last_telemetry: Date,
    last_data: mongoose.Types.ObjectId,
    all_data: [mongoose.Types.ObjectId],
    firmware_version: String,
    battery_voltage: Number,
    latest_measurement: measurementSchema
});


const gatewaySchema = new mongoose.Schema({
    name: {type: String, required: true},
    mac: {type: [Number], required: true},
    deployments: [mongoose.Types.ObjectId],
    current_deployment: mongoose.Types.ObjectId,
    wifi_credentials: [String],
    current_location: [Number],
    last_telemetry: Date,
    firmware_version: String,
    telemetry: mongoose.Mixed
});

const dataDeploymentSchema = new mongoose.Schema({
    sensor_id: {type: mongoose.Types.ObjectId, required: true},
    location: {type: [Number], required: true, index: '2dsphere'},
    delivered: {Type: Boolean, default: false},
    mac: {type: [Number], required: true}
});


const deploymentSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true},
    description: String,
    sensors: [dataDeploymentSchema],
    gateways: [dataDeploymentSchema],
    status: {type: String, default: 'pending'},
    start: Date,
    finish: Date,
    measurement_num: Number,
    tags: [String],
    measurement_interval: Number
});


const logSchema = new mongoose.Schema({
    type: String,
    message: String,
    time: Date
});

mongoose.model('measurement', measurementSchema, 'measurement');
mongoose.model('data', dataSchema, 'data');
mongoose.model('sensor', sensorSchema, 'sensor');
mongoose.model('gateway', gatewaySchema, 'gateway');
mongoose.model('deploymentData', dataDeploymentSchema, 'deploymentData');
mongoose.model('deployment', deploymentSchema, 'deployment');
mongoose.model('log', logSchema, 'log');