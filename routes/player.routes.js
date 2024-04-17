//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const playerController = require('../controller/player.controller')
//definimos las rutas

//rutas get
//router.get('/player', playerController)

//rutas post
router.post('/player', playerController.CreatePlayer);


//exportamos
module.exports = router