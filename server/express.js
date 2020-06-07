const express = require('express')
var bodyParser = require('body-parser')
const  cookieParser= require('cookie-parser')
const compress= require('compression');
const helmet = require('helmet')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())

module.exports= app