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

const deletePlaylist = async (req, res) => {
    try {
        let id = req.params.id
        let result = await playlistModel.findOneAndDelete({ _id: id })
        res.send(result)

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}
const createPlaylist = async (req, res) => {
    try {
        let nombre = req.body.nombre
        let duracion = req.body.duracion;
        let archivos = req.body.archivos
        let arrayArchivos = []
        let descripcion = req.body.descripcion


        if (duracion.trim()==0 | duracion==undefined) {
            duracion = 0
        }
        //Parseamos los valores
        nombre == nombre.trim() == 0 ? nombre = undefined : nombre = nombre.toLowerCase();
        descripcion == descripcion.trim() == 0 ? descripcion = undefined : descripcion = descripcion.toLowerCase();
        if (archivos !== undefined) {
            archivos = archivos.split(','); // Convertir la cadena de texto en un array
            try {
                //recogemos los datos de la duración de cada archivo
                //y guardamos el array id del array si es que existe
                for (const archivo of archivos) {
                    try {
                        const result = await fileModel.findOne({ _id: archivo });
                        if (result) {
                            duracion += result.datos.duracion
                            arrayArchivos.push(archivo)
                        }
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
            archivos: arrayArchivos,
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
    let filter = { _id: req.params.id }
    let nombre = req.body.nombre
    let duracion = req.body.duracion;
    let archivos = req.body.archivos
    let addArchivo = req.body.add
    // corregir: como puedo saber si el id de archivo que ha proporcionado nos va a servir para eliminar o añadir un archivo a la playlist
    let update = {
        nombre: nombre,
        duracion: duracion,
        
    }
    try {
        const result = await playlistModel.findOneAndUpate(filter, update, {
            new: true
        })
        res.send(result)

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}


module.exports = { createPlaylist, getPlaylists, getPlaylist, deletePlaylist, updatePlaylist }