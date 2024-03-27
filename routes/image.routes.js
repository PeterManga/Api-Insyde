//importamos los módulos necesarios.
const express = require('express');
const router = express.Router();
const imageController = require('../controller/image.controller');
const imageModel = require('../models/image.model.js');

//definimos las rutas

//rutas get
router.get('/image', imageController.getImage);

//rutas post (Crear)
//router.post('/image', imageController.createImage);
//POST
router.post('/image', (req, res) => {
    let nuevaImagen = new imageModel({
        nombre: req.body.nombre,
        url: req.body.url,
       
    });
    nuevaImagen.save().then(resultado => {
        if (resultado)
            res.send({ error: false });
        else
            res.send({ error: true });
    }).catch(error => {
        res.send({ error: true,message: error.message });
    });
});


// rutas put (Actualizar)
router.put('/image', imageController.updateImage);

//rutas delete (Eliminar)
router.delete('/image', imageController.deleteImage);
//exportamos
module.exports = router