//modulos necesarios
const videoModel = require('../models/video.model.js')
const cloudinaryData = require('../utils/cloudinary.js')

//Este método nos devuelve todos los vides alojados en nuetra base de datos.
const getVideos = async (req, res) => {
   try {
    const video = await videoModel.find();
    res.json(video);
   } catch (error) {
    console.log(error);
    res.status(500).send(error);
   }
}

//Este método devuelve un video según el id indicado
const getVideo = async (req, res) => {
   
    try {
        const findVideo = await videoModel.findOne({_id: req.params.id});
        if(!findVideo){
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        res.send(findVideo)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

// Este método nos permite crear de un nuevo  objeto video y añadirlo a la base de datos
const createVideo = async (req, res) => {

    try {
        //comprobamos que se ha subido un archivo
        console.log(req.files)
        //recogemos los datos
        const { nombre, descripcion, ubicacion, duracion, formato } = req.body;
        const nuevoVideo = new videoModel({ nombre, descripcion, ubicacion, duracion, formato });
        

        if (req.files?.archivo) {
            const result = await cloudinaryData.uploadData(req.files.archivo.tempFilePath)
            console.log(result)
            

            nuevoVideo.datos ={
                public_id : result.public_id,
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height
            }
            const response = await cloudinaryData.api.resource(public_id, { resource_type: 'video' });
            const duration = response.duration;
            console.log(duration)
        }
        
        //asignamos los datos recogidos al nuevo video
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
            descripcion: req.body.descripcion,
            ubicacion: req.body.ubicacion,
            duracion: req.body.duracion,
            formato: req.body.formato
        }
        const updateVideo = await videoModel.findOneAndUpdate(filter, update, {
            new: true
        });
        if(!updateVideo){
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        //mostramos los datos actualizados
        res.send(updateVideo)
    } catch (error) {
        res.status(500).send(error);
    }
}

//Este método nos permite borrar un video con el id especificado en la url
const deleteVideo = async (req, res) => {

    try {
        const deleteVideo = await videoModel.findOneAndDelete({_id: req.params.id});
        if(!deleteVideo){
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        res.send(deleteVideo)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

module.exports = { getVideo, updateVideo, deleteVideo, createVideo, getVideos }