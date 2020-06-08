const User= require('../models/user.model');
const jwt= require('jsonwebtoken');
const expressJwt= require('express-jwt');
const config= require('../../config/config');

const signin = (req, res) => {  
  User.findOne({
    "email": req.body.email
  },(err, userDb)=>{
    if (err || !userDb){
      return res.status('401').json({
        error: "User not found"
      })
    }
    User.comparePassword(req.body.password, (err, passwordMatch)=>{ //A: uso el metodo que construi en el modelo para comparar password
      if (err || !passwordMatch){
        return res.status(401).json({error: "Email and Password no match"})
      }

      const token= jwt.sign({
        _id: user._id
      }, config.jwtSecret)

      res.cookie("t", token,{
        expire: new Date() + 9999
      })
      //A: lo guardo en la cookie, el cliente puede decidir guardarlo aca
      //A: en lado del cliente , la cookie tiene que ser adjunta en el header Authorization cuando quiera acceder a rutas seguras
      
      return res.json({
        token,
        user: {_id: user._id, name: user.name, email: user.email}
      })
      //A: devuelvo la cookie en la respuestas , el cliente puede elegir guardarlo en otro lugar
    })    
  })
}

const signout = (req, res) => { 
  res.clearCookie("t")
  return res.json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})
//A: usamos express-jwt para verificar que el jwt sea valido en el header Authorization, 
//si es valido agregamos el id del usuario a req.auth

const hasAuthorization = (req, res, next) => { 
  const authorized= req.profile && req.auth && req.profile._id == req.auth._id
  //A: req.profile lo llena el metodo findUserById(userCtrl), req.auth lo llena el metodo requireSignin

  if(!authorized){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports= { signin, signout, requireSignin, hasAuthorization }