//modulos necesarios
const fileModel = require('../models/video.model.js');
const cloudinary = require('../utils/cloudinary.js');
const fsExtra = require('fs-extra')

//Este método nos devuelve todos los vides alojados en nuetra base de datos.
const getFiles = async (req, res) => {
    console.log(req.query)

    try {
        //El parametro re.query devuelve los objetos que coinciden 
        //con los parametros solicitados por el usuario
        const file = await fileModel.find(req.query);
        res.json(file);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


//Este método devuelve un video según el id indicado
const getFile = async (req, res) => {

    try {
        const findFile = await fileModel.findOne({ _id: req.params.id });
        if (!findFile) {
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        res.send(findFile)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

//metodo para obtener los metadatos de un video (experimental y así obtener la duración de este)
const getMetadatos = async (req, res) => {
    try {
        const metadatosVideo = await cloudinary.getDuration(req.params.id)
        console.log(metadatosVideo.video_metadata)
        res.send(metadatosVideo)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los metadatos' });
    }
}

// Este método nos permite crear de un nuevo  objeto video y añadirlo a la base de datos
const createFile = async (req, res) => {

    try {
        //comprobamos que se ha subido un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se ha encontrado ningún archivo.');
        }
        else {
            //recogemos los datos y los asignamos al modelo
            const nuevoFile = new fileModel({
                nombre: req.body.nombre.toLowerCase(),
                descripcion: req.body.descripcion.toLowerCase(),
                ubicacion: req.body.ubicacion.toLowerCase()
            });

            //Comprobamos que el usuario ingresa el archivo en el campo "archivo" 
            if (req.files?.archivo) {
                let type;

                //detectamos si el usuario esta intentando ingresar una imagen o un video
                //dependiendo del archivo el tipo será un 'video' o 'imagen'
                if (req.files.archivo.mimetype.includes("video")) {
                    type = "video"
                } else {
                    type = "image"
                }
                /*El video introducido es detectado en los archivos temporales
                y esperamos a que sea subido a cloudinary*/
                const result = await cloudinary.uploadData(req.files.archivo.tempFilePath, type)

                //borramos el archivo localmente
                await fsExtra.unlink(req.files.archivo.tempFilePath)

                //Guardamos el assetID que será usado para obtener la duracion del video en sus metadatos
                const assetID = result.asset_id;

                //Obtenemos los metadatos
                const metadatosVideo = await cloudinary.getDuration(assetID)
                let duracion;
                console.log(type)
                if (type==='video') {
                    duracion=metadatosVideo.video_metadata.format_duration
                } else {
                    duracion=0
                }
                //recogemos los datos del video subido y se los añadimos al modelo
                nuevoFile.datos = {
                    public_id: result.public_id,
                    url: result.secure_url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    asset_id: result.asset_id,
                    //Asigamos el campo 'duracion' obtenido de los metadatos
                    resource_type: result.resource_type,
                    duracion: duracion
                }

            }
            else {
                //si el archivo introducido no se encuentra en el campo 'archivo' o no se introduce ninguno
                res.status(400).send("Ingrese el archivo en el parámetro 'archivo'")
            }

            //asignamos los datos recogidos al nuevo video y esperamos a que se guarden los datos
            await nuevoFile.save();
            //si todo está bien, nos devuelve los datos subidos
            return res.status(201).json(nuevoFile);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al crear el video' });
    }

}

//Este método nos permite actualizar la información de un video alojado en la base de datos
const updateFile = async (req, res) => {
    try {
        //usamos el id proporcionado en la url 
        const filter = { _id: req.params.id }
        let actualizarFile;

        const findFile = await fileModel.findOne({ _id: req.params.id });
        console.log(findFile.datos.format)

        //req.files.archivo.mimetype.includes("video")

        if (req.files?.archivo) {
            let type;
            //Detectamos si el archivo es un video o imagen
            if (findFile.datos.format == "mp4") {
                type = "video"
            }
            else {
                type = "image"
            }
            //Se elimina de cloudinary el archivo asociado al objeto que vamos a actualizar de mongo
            await cloudinary.deleteFile(findFile.datos.public_id, findFile.datos)

            /*El video introducido es detectado en los archivos temporales
            y esperamos a que sea subido a cloudinary*/
            const result = await cloudinary.uploadData(req.files.archivo.tempFilePath, type)

            //Obtenemos los metadatos
            const metadatosVideo = await cloudinary.getDuration(result.asset_id)


            //bucamos en la base de datos el objeto que coincide con la id proporcionada
            // y lo actualizamos
            const datosFile = req.body;
            datosFile.datos = {
                public_id: result.public_id,
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height,
                //Asigamos el campo 'duracion' obtenido de los metadatos
                
                duracion: metadatosVideo.video_metadata.format_duration
            }
            actualizarFile = await fileModel.findOneAndUpdate(filter, datosFile, {
                new: true
            });

        }

        else {
            actualizarFile = await fileModel.findOneAndUpdate(filter, req.body, {
                new: true
            });
        }
        if (!actualizarFile) {
            res.status(404).json({
                message: 'Los datos no son correctos'
            })
        }
        // mostramos los datos actualizados
        res.send(actualizarFile)
    } catch (error) {
        res.status(500).send(error);
    }
}

//Este método nos permite borrar un video con el id especificado en la url
const deleteData = async (req, res) => {

    try {
        //Busca el archivo con id proporcionado en la base de datos y este es borrado
        const File = await fileModel.findOneAndDelete({ _id: req.params.id });
        //Si el archivo, no existe, se mostrará el siguiente error
        if (!File) return res.status(404).json({
            message: 'El video no existe'
        })
        //Detectamos si el archivo es un video o imagen
        if (File.datos.format == "mp4") {
            var type = "video"
        }
        else {
            type = "image"
        }
        //Se elimina de cloudinary el archivo asociado al objeto eliminado de mongo
        await cloudinary.deleteFile(File.datos.public_id, type)

        /*El video introducido es detectado en los archivos temporales
               y esperamos a que sea subido a cloudinary*/
        const result = await cloudinary.uploadData(req.files.archivo.tempFilePath, type)

        //borramos el archivo localmente
        await fsExtra.unlink(req.files.archivo.tempFilePath)
        return res.send(File)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


module.exports = { getFile, updateFile, deleteData, createFile, getFiles, getMetadatos }