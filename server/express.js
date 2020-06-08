const express = require('express')
const bodyParser = require('body-parser')
const cookieParser= require('cookie-parser')
const compress= require('compression');
const helmet = require('helmet')
const morgan = require('morgan')

const userRoutes= require('./routes/user.routes');
const authRoutes= require('./routes/auth.routes');

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
app.use('/', authRoutes);

app.use((err,req,res,next)=>{
  if(err.name=="UnauthorizedError"){
    res.status(401).json({"error" : err.name + ": " + err.message})
  }
  //A: cath para el error lanzado por express-jwt cuando no encuentra el token
})

module.exports= app