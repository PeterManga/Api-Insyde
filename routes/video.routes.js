//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const videoController = require('../controller/video.controller')

//definimos las rutas

//rutas get
router.get('/video',videoController.getVideo);

//rutas post (Crear)
router.post('/video', videoController.createVideo);

// rutas put (Actualizar)
router.put('/video:id', videoController.updateVideo);

//rutas delete (Eliminar)
router.delete('/video/:id', videoController.deleteVideo);
//exportamos
module.exports = router