const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const config= require('../../config/config');

const UserSchema= new mongoose.Schema({
  name:{
    type:String,
    trim: true,
    required: 'Nombre es requerido'
  },
  email:{
    type: String,
    trim: true,
    unique: 'El email ya existe',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email es requerido'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  password: {
    type: String,
    required: 'Contraseña es requerida',
  }
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports= mongoose.model('User', UserSchema);