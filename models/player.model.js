//importacion de módulos
const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    etiquetas: [{
        type: String
    }],
    playlistActual:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'playlist.model'
    }
    
},{
    //Este campo añade la fecha de creación y la fecha de actualizacion
    timestamps: true    
})
// Asociación con el modelo
let Player = mongoose.model('player', playerSchema);

//exportamos
module.exports = Player