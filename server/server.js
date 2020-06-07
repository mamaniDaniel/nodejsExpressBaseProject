const config= require('../config/config');
const app= require('./express');
const mongoose= require('mongoose');

mongoose.Promise= global.Promise;
mongoose.connect(config.mongoUri,{useNewUrlParser: true,useUnifiedTopology: true});

mongoose.connection.on('error',()=>{
  throw new Error('No se puede conectar a la base de datos: ' + config.mongoUri)
})


mongoose.connection.on('connected',()=>{
  console.log("conectado a la base datos: " + config.mongoUri)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})