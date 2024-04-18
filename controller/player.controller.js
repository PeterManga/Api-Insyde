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

        //corregir parseo de valores
        //parseamos los valores
        nombre == undefined ? nombre = null : nombre = nombre.toLowerCase()
        descripcion == undefined ? descripcion = null : descripcion = descripcion.toLowerCase()
        etiquetas == undefined ? etiquetas = null : etiquetas = etiquetas.toLowerCase()
        const nuevaPlaylist = new playerModel({
            nombre: nombre,
            descripcion: descripcion,
            etiquetas: etiquetas,
            playlistActual: req.body.playlistActual,
        })

        //guardamos los datos y los subimos a mongodb
        await nuevaPlaylist.save();
        //si todo está bien, nos devuelve los datos subidos
        return res.status(201).json(nuevaPlaylist);
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'No se creado el player correctamente'})
    }
}

//Esta función devuelve un video con el id indicado

const getPlayer = async (req, res)=>{
    try {
        //recogemos el id proporcionado con el usuario
        const result = await playerModel.finOne({_id: req.params.id});
        //Si no encontramos los datos relacionados con el id mostramos el siguiente mensaje
        res.status(400).send("No se encuentra la playlist solicitada")
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

//Esta función nos sirve para borrrar una playlist
const deletePlaylist = async (req, res) =>{
    try {
        //Busca la playlist con el id proporcionado
        const result = await playerModel.finOneAndDelete({_id: req.params.id})
        if (!result) {
            res.status(404).send("No se encuentra la playlist solicitada")
        } else {
            // mostramos los datos eliminados de la playlist eliminada     
        return res.send(result)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
}

//Esta funcion nos permite actualizar los valores de una playlist
const updatePlaylist = async (req, res)=>{
    let nombre, descripcion, etiquetas, playlistActual
    nombre = req.body.nombre;
    descripcion = req.body.descripcion
    etiquetas = req.params.etiquetas
    playlistActual = req.body.playlistActual
    
    //Parseamos los nuevos valores
    nombre == undefined ? nombre= null : nombre=nombre.toLowerCase();
    descripcion == undefined ? descripcion = null : descripcion=descripcion.toLowerCase();
    etiquetas == undefined ? etiquetas = null : etiquetas = etiquetas.toLowerCase();
    const filter = {_id: req.params.id}
    const update = { 
        descripcion: descripcion,
        etiquetas: etiquetas,
        playlistActual: req.body.playlistActual

    }
    try {
        const result = await playerModel.findOneAndUpdate( filter, update, {
            new: true
        })
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}
module.exports = {CreatePlayer, getPlayer, deletePlaylist}