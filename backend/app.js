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
var sensorController = require('./controllers/sensor');


var port = normalizePort(process.env.PORT || 3000);


var app = express();

app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

let wss = new WSS.Server({server: server});

wss.on('connection', socket => {
    socket.on('message', message => {
        let dataObj = JSON.parse(message);
        console.log(dataObj.type);
        socket.send("ok");
        console.log(dataObj);
        if (dataObj.type == 'SENSOR_READING') {
            sensorController.postDataSensorWebsocket(message).then(r => console.log(r));
        } else {
            sensorController.PostSensorTelemetryWebsockets(message).then(r => console.log(r));
        }
    });
});


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


app.use(morgan('common'));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
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

