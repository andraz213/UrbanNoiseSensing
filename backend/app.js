var express = require('express');
var path = require('path');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
require('./models/db');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res, next) => {
    console.log("sem v Access-Controlu");
    console.log(res);
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



app.use('/', indexRouter);
app.use('/api/', apiRouter);

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

