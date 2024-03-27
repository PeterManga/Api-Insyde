//modulos necesarios
const videoModel = require('../models/video.model.js')

//Este método nos devuelve todos los vides alojados en nuetra base de datos.
const getVideo = async (req, res) => {
    const video = await videoModel.find();
    res.json(video);
}

// Este método nos permite crear de un nuevo  objeto video y añadirlo a la base de datos
const createVideo = async (req, res) => {

    try {
        //recogemos los datos
        const { nombre, url, descripcion, ubicacion, duracion, formato } = req.body;
        //asignamos los datos recogidos al nuevo video
        const nuevoVideo = new videoModel({ nombre, url, descripcion, ubicacion, duracion, formato });
        console.log(nuevoVideo)
        await nuevoVideo.save();
        res.status(201).json(nuevoVideo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el video' });
    }

}

//Este método nos permite actualizar la información de un video alojado en la base de datos
const updateVideo = async (req, res) => {
    try {
        //usamos el id proporcionado en la url 
        const filter = { _id: req.params.id }

        //Recogemos los datos que nos ingresará el usuario.
        const update = {
            nombre: req.body.nombre,
            url: req.body.url,
            descripcion: req.body.descripcion,
            ubicacion: req.body.ubicacion,
            duracion: req.body.duracion,
            formato: req.body.formato
        }
        const updateVideo = await videoModel.findOneAndUpdate(filter, update, {
            new: true
        });
        //mostramos los datos actualizados
        res.send(updateVideo)
    } catch (error) {
        res.status(500).send(error);
    }
}

//Este método nos permite borrar un video con el id especificado en la url
const deleteVideo = async (req, res) => {

    try {
        const deleteVideo = await videoModel.where(req.params.id).findOneAndDelete();
        res.send(deleteVideo)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

module.exports = { getVideo, updateVideo, deleteVideo, createVideo }