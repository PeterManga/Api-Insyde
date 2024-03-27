const mongoose = require('mongoose');
const app = require('../app')
mongoose.Promise = global.Promise;

const url ='mongodb+srv://PedroInsyde:0XPGDAODlzGV9K1X@clusterprincipal.0ecscot.mongodb.net/'
mongoose.connect(url);


//Definir el puerto donde escuchará la aplicacion
const PORT = 3000;

//iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor Express en ejecucuón: Puerto ${PORT}`)
})

