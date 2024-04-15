// Importar módulos necesarios
const express = require('express');
const indexRoutes = require('./routes/index.routes');
const videoRoutes = require('./routes/file.routes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const downloader = require('./utils/downloader')

//Crear una instancia de Express
const app = express();

app.use(express.json())
app.use(morgan('dev'));
app.use(bodyParser.json());

//Fileupload para subir archivos
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
}));

//usamos las rutas definidas en otros archivos
app.use(indexRoutes)
app.use(videoRoutes)


module.exports = app