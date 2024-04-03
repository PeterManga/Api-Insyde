//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const videoController = require('../controller/video.controller')

//definimos las rutas

//rutas get
router.get('/video',videoController.getVideos);
router.get('/video/:id',videoController.getVideo);
router.get('/videoMetadatos/:id', videoController.getMetadatos)

//rutas post (Crear)
router.post('/video', videoController.createVideo);

// rutas put (Actualizar)
router.put('/video/:id', videoController.updateVideo);

//rutas delete (Eliminar)
router.delete('/video/:id', videoController.deleteData);


//exportamos
module.exports = router