//Importación de módulos necesarios
const playlistModel = require('../models/playlist.model')
const fileModel =require('../models/file.model')

const getPlaylists = async (req, res) =>{
    try {
        const playlist =await playlistModel.find();
        res.json(playlist)
    } catch (error) {
        console.error(error)
    }
}
const createPlaylist = async (req, res) => {
    try {
        let nombre = req.body.nombre
        let duracion = 0;
        let archivos = req.body.archivos
        let descripcion = req.body.descripcion
        console.log(duracion)
        //Parseamos los valores
        nombre == undefined ? null : nombre = nombre.toLowerCase();
        // duracion == undefined ? null 
        descripcion == undefined ? null : descripcion = descripcion.toLowerCase();
        archivos = archivos ? archivos.split(',') : null; // Convertir la cadena de texto en un array
        //console.log(archivos)
        try {
            for (const iterator of archivos) {
                const result = await fileModel.findOne({ _id: iterator });
                //console.log(result.datos.duracion)
                duracion+=result.datos.duracion
                console.log(duracion)
            }
            
        } catch (error) {
            console.error(error)
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
        res.status(500).send({message: "No se ha podido crear la playlist"})
    }

}



module.exports = { createPlaylist, getPlaylists}