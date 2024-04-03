//importamos lo módulos necesarios
const express = require('express');
const router = express.Router();
//Definimos las rutas
router.get('/', (req, res)=>{
    res.send('Tenemos la aplicacion conectada a la base de datos de monog db atlas');
});


//exportamos el mpdulo
module.exports = router;