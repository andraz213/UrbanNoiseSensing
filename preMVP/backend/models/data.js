var mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    location: {type: [Number], required: true, index: '2dsphere'},
    fftValues: [Number],
    fftFrequencies: [Number],
    decibels: Number,
    measured_at: { type : Date, default: Date.now },
    sensor: {type: String, required: false}
});

const sensorSchema = new mongoose.Schema({
    physical_id: {type: String, required: true},
    battery_voltage: {type: Number, required: false}
});

mongoose.model('data', measurementSchema, 'measurements');
mongoose.model('sensors', sensorSchema, 'measurements');
