//modulos necesarios
const videoModel = require('../models/video.model.js');
const cloudinary = require('../utils/cloudinary.js');
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
        const findVideo = await videoModel.findOne({ _id: req.params.id });
        if (!findVideo) {
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

//metodo para obtener los metadatos de un video (experimental y así obtener la duración de este)
const getMetadatos = async (req, res) => {
    try {
        const metadatosVideo = await cloudinary.getDuration(req.params.id)
        console.log(metadatosVideo)
        res.send(metadatosVideo)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los metadatos' });
    }
}

// Este método nos permite crear de un nuevo  objeto video y añadirlo a la base de datos
const createVideo = async (req, res) => {

    try {
        //comprobamos que se ha subido un archivo
        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se ha encontrado ningún archivo.');
        }
        //recogemos los datos
        const { nombre, descripcion, ubicacion } = req.body;
        const nuevoVideo = new videoModel({ nombre, descripcion, ubicacion });

        if (req.files?.archivo) {
            let type;
            //detectamos si el usuario esta intentando ingresar una imagen o un video
            //dependiendo del archivo el tipo será un 'video' o 'imagen'
            if (req.files.archivo.mimetype.includes("video")) {
                type="video"
            } else {
                type="image"
            }
            /*El video introducido es detectado en los archivos temporales
            y esperamos a que sea subido a cloudinary*/
            const result = await cloudinaryData.uploadData(req.files.archivo.tempFilePath,type)
            //console.log(result)
            //recogemos los datos del video subido y se los añadimos al modelo
            nuevoVideo.datos = {
                public_id: result.public_id,
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height
            }
           var publicID =result.public_id
            //console.log(nuevoVideo)           

            //asignamos los datos recogidos al nuevo video y esperamos a que se guarden los datos
            //console.log(nuevoVideo)
            await nuevoVideo.save();
            //si todo está bien, nos devuelve los datos subidos
            res.status(201).json(nuevoVideo);
        }
        else {
            //si el archivo introducido no se encuentra en el campo 'archivo' o no se introduce ninguno
            //se le mostrará el siguiente mensaje al usuario
            res.status(400).send("Ingrese el archivo en el parámetro 'archivo'")
        }
        //En desarrollo: aqui intento obtener la duración a traves de los metadatos
        //e introducir estos campos al modelo
        try {
            
            const duracion = await cloudinaryData.apiCloudinary.resource_by_asset_id(publicID,{
                media_metadata: true
            })
            console.log(duracion)
        } catch (error) {
            res.status(500).send("error al hacer al consulta de duracion")
        }
        //aqui estaba antes nuevo archivo.save y re.status 

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
        //bucamos en la base de datos el objeto que coincide con la id proporcionada
        // y lo actualizamos
        const updateVideo = await videoModel.findOneAndUpdate(filter, update, {
            new: true
        });
        //si el 
        if (!updateVideo) {
            res.status(404).json({
                message: 'Los datos no son correctos'
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
        const deleteVideo = await videoModel.findOneAndDelete({ _id: req.params.id });
        if (!deleteVideo) {
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

module.exports = { getVideo, updateVideo, deleteVideo, createVideo, getVideos, getMetadatos }