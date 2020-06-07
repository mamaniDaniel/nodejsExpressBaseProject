const express= require('express');
const userCtrl= require('../controllers/user.controller');

const router= express.Router();

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/:userId')
.get(userCtrl.read)
.put(userCtrl.update)
.delete(userCtrl.remove)

router.param('userId', userCtrl.userByID) //A: callback que se ejecuta siempre que el param userId este presente en la peticion antes de entrar a cualquier ruta

module.exports= router