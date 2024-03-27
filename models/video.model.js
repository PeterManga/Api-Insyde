//importacion de módulos
const moongose = require('mongoose');

// Definición del esquema
const videoSchema=moongose.Schema({
    nombre: {
        type: String
    },
    url: {
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
    formato:{
        type: String
      
    }
},{
    timestamps: true
})

// Asociación con el modelo
let Video = moongose.model('video', videoSchema);

//exportamos
module.exports = Video