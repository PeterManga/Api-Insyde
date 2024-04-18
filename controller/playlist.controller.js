//Importación de módulos necesarios
const playlistModel = require('../models/playlist.model')
const fileModel = require('../models/file.model');

const getPlaylists = async (req, res) => {
    try {
        const result = await playlistModel.find();
        res.json(result)
    } catch (error) {
        console.error(error)
    }
}
const getPlaylist = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await playlistModel.findOne({ _id: id })
        return res.send(result)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }

}

const deletePlaylist = async (req, res)=>{
    try {
        let id = req.params.id
        let result = await playlistModel.findOneAndDelete({_id: id})
        res.send(result)
        
    } catch (error) {
        console.error(error)
        res.status(500).send(error)        
    }
}
const createPlaylist = async (req, res) => {
    try {
        let nombre = req.body.nombre
        let duracion = 0;
        let archivos = req.body.archivos
        let descripcion = req.body.descripcion
        //Parseamos los valores
        nombre == undefined ? null : nombre = nombre.toLowerCase();
        descripcion == undefined ? null : descripcion = descripcion.toLowerCase();
        if (archivos == undefined | archivos == '') {
            archivos = null
        }
        else {
            archivos = archivos.split(','); // Convertir la cadena de texto en un array
            try {
                //recogemos los datos de la duración de cada archivo
                //corregir: Comprobar que id proporcionado por el usuario existe en la base de datos
                // y si no existe, eliminaremos el id indicado del
                for (const archivo of archivos) {
                    try {
                        const result = await fileModel.findOne({ _id: archivo });
                        duracion += result.datos.duracion
                    } catch (error) {
                        console.error(error)
                        res.status(500).send(error)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }

        const result = new playlistModel({
            nombre: nombre,
            archivos: archivos,
            descripcion: descripcion,
            duracion: duracion
        })

        await result.save();
        return res.status(201).json(result);
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
    }

}

// método para actualizar los datos de una playlist
//corregir: hay que obtener la duracion total de la playlist antes de añadirle el nuevo archivo o eliminarlo de la playlist
const updatePlaylist = async (req, res) => {
    let filter = { _id: req.params.id}
    let nombre, duracion, archivos, descripcion
    let update = {

    }
    try {
        const result = await playlistModel.findOneAndUpate( filter, update, {
            new: true
        })
        res.send(result)
        
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}


module.exports = { createPlaylist, getPlaylists, getPlaylist, deletePlaylist, updatePlaylist}