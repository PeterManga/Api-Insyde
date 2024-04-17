//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const playListController = require('../controller/playlist.controller')

//rutas get
router.get('/playlists',playListController.getPlaylists)
router.get('/playlist/:id',playListController.getPlaylist)

//rutas post
router.post('/playlist', playListController.createPlaylist )
//rutas delete
router.delete('/playlist/:id',playListController.deletePlaylist)


//exportamos
module.exports = router