const mongoose = require('mongoose');
const app = require('./app')
require('dotenv').config();
mongoose.Promise = global.Promise;

const url =process.env.URL
mongoose.connect(url);


//Definir el puerto donde escuchará la aplicacion
const PORT = process.env.PORT;

//iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor Express en ejecucuón: Puerto ${PORT}`)
})

