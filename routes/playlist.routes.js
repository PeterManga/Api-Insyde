//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const playListController = require('../controller/playlist.controller')

//rutas get
router.get('/playlists',playListController.getAllPlaylist)
router.get('/playlist/:id',playListController.getPlaylist)

//rutas post
router.post('/playlist', playListController.createPlaylist )

//rutas delete
router.delete('/playlist/:id',playListController.deletePlaylist)

//rutas put (update)
router.put('/playlist/:id', playListController.updatePlaylist)
//exportamos
module.exports = router