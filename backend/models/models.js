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
    current_location: [Number],
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
    delivered: {Type: Boolean, default: false}
});



const deploymentSchema = new mongoose.Schema({
    id: {type: mongoose.Types.ObjectId, required: true},
    name: {type: String, required: true},
    description: String,
    sensors: [dataDeploymentSchema],
    gateways: [dataDeploymentSchema],
    start: Date,
    finish: Date,
    measurement_num: Number,
    tags: [String]
});

mongoose.model('measurement', measurementSchema, 'database');
mongoose.model('data', dataSchema, 'database');
mongoose.model('sensor', sensorSchema, 'database');
mongoose.model('gateway', gatewaySchema, 'database');
mongoose.model('deploymentData', dataDeploymentSchema, 'database');
mongoose.model('deployment', deploymentSchema, 'database');
