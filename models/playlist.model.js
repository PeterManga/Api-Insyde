
 //importación de módulos
 const moongose = require('mongoose');

 playlistSchema = moongose.Schema({
    nombre: {
        type: String
    },
    duracion: {
        type: Number
    },
    archivos: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'file.model'
    }
 },{
     //Este campo añade la fecha de creación y la fecha de actualizacion
     timestamps: true
 })

 // Asociación con el modelo
let Playlist = moongose.model('playlist', playlistSchema);

//exportamos
module.exports = Playlist
 