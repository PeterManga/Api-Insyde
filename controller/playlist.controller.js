//Importación de módulos necesarios
const playlistModel = require('../models/playlist.model')
const fileModel = require('../models/file.model');

const getAllPlaylist = async (req, res) => {
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
        let duracion = req.body.duracion || 0; 
        let archivos = req.body.archivos
        let arrayArchivos = []
        let descripcion = req.body.descripcion

        
        //Parseamos los valores
        nombre == nombre.trim() == 0 ? nombre = undefined : nombre = nombre.toLowerCase();
        descripcion == descripcion.trim() == 0 ? descripcion = undefined : descripcion = descripcion.toLowerCase();
        if (archivos !== undefined) {
            //archivos = archivos.split(','); // Convertir la cadena de texto en un array
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

        //asignamos a result los valore sobtenidos
        const result = new playlistModel({
            nombre: nombre,
            archivos: arrayArchivos,
            descripcion: descripcion,
            duracion: duracion
        })
        //Esperamos a que se guarde la playlist y mostramos los resultados
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
    let descripcion = req.body.descripcion
    let archivos = req.body.archivos
    let deleteArchivo = req.body.delete
    console.log(deleteArchivo)
    let update
    let arrayArchivos = []
    let duracionArchivos = 0
    // corregir: como puedo saber si el id de archivo que ha proporcionado nos va a servir para eliminar o añadir un archivo a la playlist
    if (archivos !== undefined) {
        archivos = archivos.split(','); // Convertir la cadena de texto en un array
        try {
            //recogemos los datos de la duración de cada archivo
            //y guardamos el array id del array si es que existe
            for (const archivo of archivos) {
                try {
                    const result = await fileModel.findOne({ _id: archivo });
                    if (result) {
                        duracionArchivos += result.datos.duracion
                        arrayArchivos.push(result._id)
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

 //Sí el campo deleteArchivo existe, se eliminará el id del archivo en toda la playlist y se descontará el valor de la duración de cada archivo
    if (deleteArchivo) {
        let result2 = await playlistModel.findOne({ _id: req.params.id })
        let arrayOriginal = result2.archivos
        console.log(arrayOriginal)
        if (arrayOriginal[deleteArchivo]==archivos[deleteArchivo]) {
            arrayOriginal.splice(deleteArchivo, 1)
        }

        update = {
            nombre: nombre,
            descripcion: descripcion,
            $inc: { duracion: - duracionArchivos },
            archivos: arrayOriginal
    
        }
       
    }
    // en caso contrario, se añadirá el id del archivo a nuestra playlist y se sumará la duración de los archivos a la de nuestra playlist
    else{
        update = {
            nombre: nombre,
            descripcion: descripcion,
            $push: { archivos: arrayArchivos },
            $inc: { duracion: duracionArchivos }
    
        }
    }

     
    try {
        const result = await playlistModel.findOneAndUpdate(filter, update, {
            new: true
        })
        res.status(200).send(result)

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}


module.exports = { createPlaylist, getAllPlaylist, getPlaylist, deletePlaylist, updatePlaylist }