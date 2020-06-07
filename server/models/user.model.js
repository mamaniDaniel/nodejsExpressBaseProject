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
    required: 'Contraseña es requerida'
  }
})


//INFO: https://stackoverflow.com/a/14595363/10401760
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(config.SaltWorkFactor, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports= mongoose.model('User', UserSchema);