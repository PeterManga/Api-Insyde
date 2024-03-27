//modulos necesarios
const videoModel = require('../models/video.model.js')


const getVideo = async (req, res)=>{
    const video = await videoModel.find();
    res.json(video);
}

//método para la creación de un nuevo video
const createVideo = async (req, res)=>{
    
    //console.log(nombre, url, descripcion, ubicacion, duracion, formato)
    try {
        //recogemos los datos
        const {nombre, url, descripcion, ubicacion, duracion, formato} = req.body;
        //asignamos los datos recogidos al nuevo video
        const nuevoVideo = new videoModel({nombre, url, descripcion, ubicacion, duracion, formato});
        console.log(nuevoVideo)
        await nuevoVideo.save();
        res.status(201).json(nuevoVideo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el video' });
    }
    
}


const updateVideo = (req, res)=>{
    res.send('Actulizando videos');
}

const deleteVideo = (req, res)=>{
    res.send('Eliminando videos');
}

module.exports = {getVideo,updateVideo,deleteVideo,createVideo}