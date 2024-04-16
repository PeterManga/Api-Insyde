//importacion de módulos
const moongose = require('mongoose');

const playerSchema = moongose.Shema({
    id: {
        type: String
    },
    nombre: {
        type: String
    }
    
},{
    //Este campo añade la fecha de creación y la fecha de actualizacion
    timestamps: true
})
// Asociación con el modelo
let Player = moongose.model('player', playerSchema);

//exportamos
module.exports = Player