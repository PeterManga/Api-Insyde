//Importación de módulos necesarios
const playlistModel = require('../models/playlist.model')
const fileModel = require('../models/file.model');
const mongoose = require('mongoose');


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
        const playlistId = req.params.id;

        // Buscar todos los archivos que tienen esta playlist
        const filesToUpdate = await fileModel.find({ 'playlist.playlistId': playlistId });
        // Eliminar la referencia a la playlist en cada archivo
        const updatePromises = filesToUpdate.map(async (file) => {
            file.playlist = file.playlist.filter(playlist => playlist.playlistId.toString() !== playlistId, console.log(file.playlist)
        );
            await file.save();
        });

        // Esperar a que todas las actualizaciones se completen
        await Promise.all(updatePromises);

        // Eliminar la playlist
        const result = await playlistModel.findOneAndDelete({ _id: playlistId });

        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

// corregir: este método solo permitirá crear la playlist, 
// será vacia y luego crearemos otro método para añadir los archivos a la playlist
const createPlaylist = async (req, res) => {
    try {
        let nombre = req.body.nombre
        let duracion = req.body.duracion || 0;
        // let archivos = req.body.archivos
        // let arrayArchivos = []
        let descripcion = req.body.descripcion


        //Parseamos los valores
        nombre == nombre.trim() == 0 ? nombre = undefined : nombre = nombre.toLowerCase();
        descripcion == descripcion.trim() == 0 ? descripcion = undefined : descripcion = descripcion.toLowerCase();
        // if (archivos !== undefined) {
        //     archivos = archivos.split(','); // Convertir la cadena de texto en un array
        //     try {
        //         //recogemos los datos de la duración de cada archivo
        //         //y guardamos el array id del array si es que existe
        //         for (const archivo of archivos) {
        //             try {
        //                 const result = await fileModel.findOne({ _id: archivo });
        //                 if (result) {
        //                     duracion += result.datos.duracion
        //                     arrayArchivos.push({archivoId:archivo})
        //                 }
        //             } catch (error) {
        //                 console.error(error)
        //                 res.status(500).send(error)
        //             }
        //         }
        //     } catch (error) {
        //         console.error(error)
        //     }
        // }

        //asignamos a result los valore sobtenidos
        const result = new playlistModel({
            nombre: nombre,
            // archivos: arrayArchivos,
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
//corregir: hay que comparar el indice que estamos buscando en los datos del array original para evitar eliminar datos de manera erónea
//Hacer todo esto un un bule for, por ahora solo estamos usando un solo índice
const updatePlaylist = async (req, res) => {
    let filter = { _id: req.params.id }
    let nombre = req.body.nombre
    let descripcion = req.body.descripcion
    let archivos = req.body.archivos
    let deleteArchivo = Array.from(req.body.delete)  //corregir: para que detecte si deleteArchivo es un array o string
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
        let reducirDuracion = 0
        let result2 = await playlistModel.findOne({ _id: req.params.id })
        let arrayOriginal = result2.archivos
        console.log(result2)
        console.log(archivos)
        //corregir: convertir deleteArchivo en en un array con todos los indices que dabemos eliminar

        // Iterar sobre deleteArchivo y buscar cada elemento en arrayOriginal
        for (const deleteIndex of deleteArchivo) {
            // Obtener el archivo correspondiente en arrayOriginal
            const archivoAEliminar = arrayOriginal[deleteIndex];
            // Remover el archivo de arrayOriginal
            arrayOriginal.splice(deleteIndex, 1);

            try {
                // Encontrar el archivo en la base de datos para calcular la duración reducida
                const result = await fileModel.findOne({ _id: archivoAEliminar });
                if (result) {
                    reducirDuracion += result.datos.duracion;
                }
            } catch (error) {
                console.error(error);
                return res.status(500).send(error);
            }
        }

        // Actualizar el documento de la playlist con la duración reducida y los archivos actualizados
        update = {
            nombre: nombre,
            descripcion: descripcion,
            $inc: { duracion: -reducirDuracion },
            archivos: arrayOriginal
        };
    }
    // en caso contrario, se añadirá el id del archivo a nuestra playlist y se sumará la duración de los archivos a la de nuestra playlist
    else {
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