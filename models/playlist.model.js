
 //importación de módulos
 const mongoose = require('mongoose');

 playlistSchema = mongoose.Schema({
    nombre: {
        type: String
    },
    duracion: {
        type: Number
    },
    archivos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file.model.js'
    }],
    descripcion:{
        type: String
    }
 },{
     //Este campo añade la fecha de creación y la fecha de actualizacion
     timestamps: true
 })

 // Asociación con el modelo
let Playlist = mongoose.model('playlist', playlistSchema);

//exportamos
module.exports = Playlist
 