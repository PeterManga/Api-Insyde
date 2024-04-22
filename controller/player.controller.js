//Importamos los módulos necesarios
const playerModel = require('../models/player.model')

const CreatePlayer = async (req, res) =>{
    try {
        //recogemos los datos y los parseamos a minúsculas
        //Con esto evitamos problemas futuros relacionados con
        let nombre = req.body.nombre,
        descripcion = req.body.descripcion ,
        etiquetas = req.body.etiquetas

        //corregir parseo de valores
        //parseamos los valores
        nombre == undefined ? nombre = null : nombre = nombre.toLowerCase()
        descripcion == undefined ? descripcion = null : descripcion = descripcion.toLowerCase()
        etiquetas == undefined ? etiquetas = null : etiquetas = etiquetas.toLowerCase()
        const result = new playerModel({
            nombre: nombre,
            descripcion: descripcion,
            etiquetas: etiquetas,
            playlistActual: req.body.playlistActual,
        })

        //guardamos los datos y los subimos a mongodb
        await result.save();
        //si todo está bien, nos devuelve los datos subidos
        return res.status(201).json(result);
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'No se creado el player correctamente'})
    }
}

//Esta funcion nos devuelve el player con solicitado
const getPlayer = async (req, res)=>{
    try {
        //recogemos el id proporcionado con el usuario
        const result = await playerModel.finOne({_id: req.params.id});
        //Si no encontramos los datos relacionados con el id mostramos el siguiente mensaje
        res.status(400).send("No se encuentra el player solicitado")
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

//Esta función devuelve todos los player
const getAllPlayers = async (req,res)=>{
    try {
        const result = await playerModel.find();
        res.send(result)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

//Esta función nos sirve para borrrar un player
const deletePlayer = async (req, res) =>{
    try {
        //Busca el player con el id proporcionado
        const result = await playerModel.finOneAndDelete({_id: req.params.id})
        if (!result) {
            res.status(404).send("No se encuentra el player solicitado")
        } else {
            // mostramos los datos del player eliminado     
        return res.send(result)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
}

//Esta funcion nos permite actualizar los valores de un player
const updatePlayer = async (req, res)=>{
    let nombre, descripcion, etiquetas
    nombre = req.body.nombre;
    descripcion = req.body.descripcion
    etiquetas = req.params.etiquetas
    
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
module.exports = {CreatePlayer, getPlayer, deletePlayer, updatePlayer, getAllPlayers}