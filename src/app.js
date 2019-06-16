require('dotenv').config({
    path: process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'test' ? '.env.test' : '.env'
})

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const winston = require('winston')
const expressWinston = require('express-winston')
const app = express()

//LOGGER
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: 'log/server.log'
        })
    ],
    format: winston.format.combine(
        winston.format.simple()
    ),
    statusLevels: true,
    skip: function (req, res) {
        return res.statusCode == 200
    },
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
        return false;
    } // optional: allows to skip some log messages based on request and/or response
}))

//PUBLIC 
app.use('/', express.static('public'))
app.use('/js/sw.js', express.static('public/js/sw.js', {
    maxAge: 0
}));


//BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//BANCO DE DADOS
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true
});

// ROTAS
const api = require('./routers/api.router')
app.use('/api', api)

//TRATEMENTO DE ERRO
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            filename: 'log/error.log',
            level: 'error'
        })
    ],
    format: winston.format.combine(
        winston.format.simple()
    ),
}))

app.use((err, req, res, next) => {
    if (res.get('Content-type') == 'application/json') {
        return res.status(500).json({
            message: err.message
        })
    } else {
        return res.status(500).render('error.ejs', {
            error: err
        })
    }
})

module.exports = app