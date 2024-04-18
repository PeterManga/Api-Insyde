
 //importación de módulos
 const mongoose = require('mongoose');

 const calendarSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    playlistId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'playlist.model'
    }],
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date
    },
   
    
 },{
    //Este campo añade la fecha de creación y la fecha de actualizacion
    timestamps: true
})