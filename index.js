//importamos los modulos necesarios
const mongoose = require('mongoose');
const app = require('./app')
require('dotenv').config();
mongoose.Promise = global.Promise;

//Obtenemos la url de la conexion
const url =process.env.URL

//realizamos la conexion con mongoose
mongoose.connect(url);


//Definir el puerto donde escuchará la aplicacion
const PORT = process.env.PORT;

//iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor Express en ejecucuón: Puerto ${PORT}`)
})

