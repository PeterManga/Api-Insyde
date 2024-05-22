// Importar módulos necesarios
const express = require('express');
const videoRoutes = require('./routes/file.routes');
const indexRoutes = require('./routes/index.routes')
const playerRoutes = require('./routes/player.routes')
const playlistRoutes = require('./routes/playlist.routes')
const calendarRoutes = require('./routes/calendar.routes')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');




//Crear una instancia de Express
const app = express();

app.use(express.json())
app.use(morgan('dev'));
app.use(bodyParser.json());
// Habilitar CORS para todas las solicitudes
app.use(cors());

//Fileupload para subir archivos
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
}));

//usamos las rutas definidas en otros archivos
app.use(videoRoutes)
app.use(indexRoutes)
app.use(playerRoutes)
app.use(playlistRoutes)
app.use(calendarRoutes)

module.exports = app