const moongose = require('mongoose');
const imageSchema=moongose.Schema({
    nombre: {
        type: String
        
    },
    url: {
        type: String
    }
    
})

module.exports = moongose.model('image',imageSchema )