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
        resource_type: String,
        format: String,
        asset_id: String,
        width: String,
        height: String,
        duracion: Number
    }
}, {
    timestamps: true
})

// Asociación con el modelo
let File = moongose.model('file', fileSchema);

//exportamos
module.exports = File