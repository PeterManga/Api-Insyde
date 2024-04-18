//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const playerController = require('../controller/player.controller')
//definimos las rutas

//rutas get
router.get('/players', playerController.getPlayers)
router.get('/player/:id', playerController.getPlayer)

//rutas post (crear)
router.post('/player', playerController.CreatePlayer);

//rutas delete (eliminar)
router.delete('/player/:id', playerController.deletePlayer)

//rutas put (update)
router.put('/player/:id',playerController.updatePlayer)
//exportamos
module.exports = router