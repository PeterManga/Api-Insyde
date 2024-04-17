//Importación de módulos necesarios
const playlistModel = require('../models/playlist.model')
const fileModel = require('../models/file.model');
const { reset } = require('nodemon');

const getPlaylists = async (req, res) => {
    try {
        const playlist = await playlistModel.find();
        res.json(playlist)
    } catch (error) {
        console.error(error)
    }
}
const getPlaylist = async (req, res) => {
    try {
        let id = req.params.id;
        let playlist = await playlistModel.findOne({ _id: id })
        return res.send(playlist)
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
                for (const archivo of archivos) {
                    const result = await fileModel.findOne({ _id: archivo });
                    duracion += result.datos.duracion
                }
            } catch (error) {
                console.error(error)
            }
        }

        const nuevaPlaylist = new playlistModel({
            nombre: nombre,
            archivos: archivos,
            descripcion: descripcion,
            duracion: duracion
        })

        await nuevaPlaylist.save();
        return res.status(201).json(nuevaPlaylist);
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
    }

}



module.exports = { createPlaylist, getPlaylists, getPlaylist, deletePlaylist}