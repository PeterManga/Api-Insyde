//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const fileController = require('../controller/file.controller')
  
//definimos las rutas

//rutas get
router.get('/', (req, res)=>{ //ruta raiz
    res.send('Tenemos la aplicacion conectada a la base de datos de monog db atlas');
});
//
router.get('/files',fileController.getFiles); //Obtener
router.get('/file/:id',fileController.getFile);
router.get('/fileMetadatos/:id', fileController.getMetadatos)
router.get('/getPlaylist', fileController.getPlaylist);

//rutas post (Crear)
router.post('/file', fileController.createFile);

// rutas put (Actualizar)
router.put('/file/:id', fileController.updateFile);

//rutas delete (Eliminar)
router.delete('/file/:id', fileController.deleteData);


//exportamos
module.exports = router