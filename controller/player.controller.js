//Importamos los módulos necesarios
const playerModel = require('../models/player.model')

const CreatePlayer = async (req, res) =>{
    try {
        //recogemos los datos y los parseamos a minúsculas
        //Con esto evitamos problemas futuros relacionados con
        let nombre = req.body.nombre,
        descripcion = req.body.descripcion ,
        etiquetas = req.body.etiquetas,
        playlistActual = req.body.playlistActual
        let ultimaPlaylist = req.body.ultimaPlaylist
        let calendarioPlaylist = req.body.calendarioPlaylist  

        //corregir parseo de valores
        //parseamos los valores
        nombre == undefined ? nombre = null : nombre = nombre.toLowerCase()
        descripcion == undefined ? descripcion = null : descripcion = descripcion.toLowerCase()
        //etiquetas == undefined ? etiquetas = null : etiquetas = etiquetas.toLowerCase()
        const nuevaPlaylist = new playerModel({
            nombre: nombre,
            descripcion: descripcion,
            etiquetas: req.body.etiquetas,
            playlistActual: req.body.playlistActual,
            ultimaPlaylist: req.body.ultimaPlaylist,
            calendarioPlaylist: req.body.calendarioPlaylist
        })
        console.log(nuevaPlaylist)

        //guardamos los datos y los subimos a mongodb
        await nuevaPlaylist.save();
        //si todo está bien, nos devuelve los datos subidos
        return res.status(201).json(nuevaPlaylist);
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'No se creado el player correctamente'})
        
    }
}

module.exports = {CreatePlayer}