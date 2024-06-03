//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const fileController = require('../controller/file.controller')
const authRequired = require('../middlewares/auth.middleware')

//definimos las rutas

//rutas get
router.get('/files',authRequired, fileController.getAllFiles); 
router.get('/file/:id',authRequired, fileController.getFile);
router.get('/fileMetadatos/:id', authRequired,fileController.getMetadatos)
router.get('/downloadplaylist',authRequired, fileController.downloadPlaylist);
router.get('/getplaylist',authRequired, fileController.getFilesByPlayer);

//rutas post (Crear)
router.post('/file', fileController.createFile);

// rutas put (Actualizar)
router.put('/file/:id', fileController.updateFile);
router.put('/filedetaills/:id', fileController.deleteFilePlaylist)

//rutas delete (Eliminar)
router.delete('/file/:id', fileController.deleteFile);


//exportamos
module.exports = router