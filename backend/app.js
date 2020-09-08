var express = require('express');
var path = require('path');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var http = require('http');
var debug = require('debug')('backend:server');
var WSS = require('ws');
require('./models/db');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');
var port = normalizePort(process.env.PORT || 3000);



var app = express();

app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

let wss = new WSS.Server({ server: server});

wss.on('connection', socket => {
    socket.on('message', message =>{
        let dataObj = JSON.parse(message);
        console.log(dataObj.type);
        postDataSensorWebsocket(message).then(r => socket.send(r));

    });
});




server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



app.use(morgan('common'));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public', 'UNSfrontend', 'dist', 'UNSfrontend')));

app.use('/api', (req, res, next) => {
    console.log("sem v Access-Controlu");
    //console.log(res);
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



app.use('/', indexRouter);
app.use('/api/', apiRouter);

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'UNSfrontend', 'dist', 'UNSfrontend', 'index.html'));
});

app.use((req, res, next) => {
    const error = new Error(`Not fount - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: error.stack
    });

});

module.exports = app;

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}








const postDataSensorWebsocket = async (JSNdata) => {

    let data = JSON.parse(JSNdata);


            // najdi senzor
            let sensorMac = data.mac;
            console.log(sensorMac);
            let currentSensor = await sensorModel.find({mac: sensorMac}).select({_id:1, current_deployment:1, last_data:1, current_location:1, name:1}).limit(1).exec();
            let newSize = 1;
            console.log(currentSensor);

            if (currentSensor != null && currentSensor.length == 1) {
                let oneSensor = currentSensor[0];
                if (oneSensor.current_deployment != null && oneSensor.current_deployment != '') {
                    let currentData;
                    if (oneSensor.last_data != null) {
                        currentData = await dataModel.findById(oneSensor.last_data).select({_id: 1, size: 1, last: 1, first: 1}).exec();
                    }
                    if (currentData == null || currentData.length == 0 || currentData.size >= 1000) {
                        currentData = new dataModel();
                        currentData.deployment = oneSensor.current_deployment;
                        currentData.location = oneSensor.current_location;
                        currentData.sensor = oneSensor._id;
                        currentData.size = 1;
                        let oo = await currentData.save();
                        // oneSensor.all_data.push(currentData._id);
                        oneSensor.last_data = currentData._id;
                        let res = await oneSensor.save();
                    } else {
                        //newSize = (await dataModel.aggregate([{$match: {_id: currentData._id}}, {$project: {data: {$size: '$data'}}}]))[0].data + 1;
                        newSize = currentData.size + 1;
                    }
                    console.log(currentData);



                    let measurement = {
                        frequencyRange: data.fft_range,
                        fftValues: data.fft_values,
                        decibels: data.decibels,
                        measured_at: new Date(data.timestamp*1000),
                        //measured_at: Date.now()
                    };
                    //console.log(Date(data.timestamp));
                    console.log(currentData.last);
                    console.log(measurement.measured_at);
                    console.log(currentData.last < measurement.measured_at);

                    if (currentData.last < measurement.measured_at) {
                        currentData.last = measurement.measured_at;
                    }
                    if (currentData.first > measurement.measured_at) {
                        currentData.first = measurement.measured_at;
                    }
                    await sensorModel.updateOne({_id: oneSensor._id}, {latest_measurement: measurement});
                    await dataModel.updateOne({_id: currentData._id}, {size: newSize, last: currentData.last, first: currentData.first, $addToSet: {data: measurement}}, (err, data) => {
                        if (err) {
                        }

                    });


                } else {
                }
            } else {

            }


    return "ok";
}


























