require('dotenv').config();
const express = require('express');
const app = express();
const port  = process.env.PORT || 3000;
const bodyParser = require('body-parser');


app.listen(port, () => console.log('listening on port', port));

var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');

require('./models/db');

var indexApi = require('./routes/index');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;