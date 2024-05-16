
//importación de módulos
const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    evento: [{
        playlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'playlist.model'
        },
        playlistName: String,
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'player.model'
        },
        playerName: String,
        fechaInicio: {
            type: Date,
            required: true
        },
        fechaFin: {
            type: Date,
            required: true
        },
        eventoName: String,
        eventoDescripcion: String,
        repetir: Boolean
    }]

}, {
    //Este campo añade la fecha de creación y la fecha de actualizacion
    timestamps: true
})