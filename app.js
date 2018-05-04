/*jshint esversion: 6 */
require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const session = require('express-session');
const expressSanitized = require('express-sanitize-escape');
// const promise = require('bluebird');
const sqlite = require('sqlite');

var fs = require('fs');

const index = require('./routes/index');
const api = require('./routes/api');

const app = express();

// let database = new sqlite.Database(process.env.DB_PATH);


const dbPromise = Promise.resolve()
    .then(() => sqlite.open(process.env.DB_PATH, {
        Promise
    }))
    .then(db => db.migrate({
        force: 'last'
    }))
    .then(db => db.close());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressSanitized.middleware());
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'b4k3rl0y4lty',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));

app.use('/', index);
app.use('/api', api);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;