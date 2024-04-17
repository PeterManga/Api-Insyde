//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const playListController = require('../controller/playlist.controller')

//rutas get
router.get('/playlists',playListController.getPlaylists)
//rutas post
router.post('/playlist', playListController.createPlaylist )

//exportamos
module.exports = router