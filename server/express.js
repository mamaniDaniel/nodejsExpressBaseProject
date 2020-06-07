const express = require('express')
var bodyParser = require('body-parser')
const  cookieParser= require('cookie-parser')
const compress= require('compression');
const helmet = require('helmet')
const userRoutes= require('./routes/user.routes');
var morgan = require('morgan')

const app = express()

morgan.token('host', function(req, res) {
  return req.hostname;
});

app.use(morgan(':method :host status::status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())

app.use('/', userRoutes);

module.exports= app