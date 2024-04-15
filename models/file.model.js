//importacion de módulos
const moongose = require('mongoose');

// Definición del esquema
const fileSchema = moongose.Schema({
    nombre: {
        type: String
    },
    descripcion: {
        type: String,
    },
    ubicacion: {
        type: String
    },
    duracion: {
        type: String
    },
    datos: {
        public_id: String,
        url: String,
        resource_type: String,  //tipo de recurso video/imagen/etc
        format: String,
        asset_id: String,
        width: String,
        height: String,
        //Este campo será util a la hora de crear una playlist para los videos
        duracion: Number
    }
}, {
    //Este campo añade la fecha de creación y la fecha de actualizacion
    timestamps: true
})

// Asociación con el modelo
let File = moongose.model('file', fileSchema);

//exportamos
module.exports = File