var express = require('express');
var path = require('path');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var http = require('http');
var WSS = require('ws');
require('./models/db');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

let wssServer = http.createServer(app);
let wss = new WSS.Server({ server: wssServer});

wss.on('connection', socket => {
    socket.on('message', message => console.log(message));
    });

wssServer.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${wssServer.address().port} :)`);
});

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

