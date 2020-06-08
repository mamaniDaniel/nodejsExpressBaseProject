const User= require('../models/user.model');
//import _ from 'lodash'
const errorHandler= require('../helpers/dbErrorHandler');

const create = (req, res, next) => { 
  const user= new User(req.body)
  user.save((err, userDb)=>{
    if (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    userDb.password= undefined
    res.json({
      message: 'usuario creado',
      user: userDb
    })
  })
}

const list = (req, res) => { 
  User.find({},{password: 0},(err, users)=>{
    if(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  })
}

const userByID = (req, res, next, id) => {  //A: lleno el body con el campo profile con el usuario que conincide con el id que me mandaron
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  })
}

const read = (req, res) => { 
  req.profile.password= undefined;
  return res.json(req.profile)
}

const update = (req, res, next) => { 
  let user= req.profile;
  user= Object.assign(user, req.body); //A: piso los valores del body en el user de la db que viene en el req gracias a userById
  user.updated= Date.now();
  User.findOneAndUpdate({_id: req.profile._id}, user,{new: true,useFindAndModify: false} , (err, userDb)=>{
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    userDb.password = undefined
    res.json(userDb)
  })
}

const remove = (req, res, next) => { 
  let user = req.profile
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.password = undefined
    res.json(deletedUser)
  }) 
}

module.exports= { create, userByID, read, list, remove, update }

