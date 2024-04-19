//modulos necesarios
const fileModel = require('../models/file.model.js');
const cloudinary = require('../utils/cloudinary.js');
const playlistModel = require('../models/playlist.model.js')
const fsExtra = require('fs-extra')
const archiver = require('archiver')
const axios = require('axios');

//Este método nos devuelve todos los vides alojados en nuetra base de datos.
const getFiles = async (req, res) => {

    try {
        //El parametro req.query devuelve los objetos que coinciden 
        //con los parametros solicitados por el usuario
        const file = await fileModel.find();
        res.json(file);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


//Este método devuelve un video según el id indicado
const getFile = async (req, res) => {

    try {
        //recogemos el id proporcionado por el usuario
        const findFile = await fileModel.findOne({ _id: req.params.id });
        //si no encontramos datos relacionados con el id mostramos el siguiente mensaje
        if (!findFile) {
            res.status(404).json({
                message: 'El video no existe'
            })
        }
        //Si todo sale bien mostramos los datos en la respuesta
        res.send(findFile)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

//metodo para obtener los metadatos de un archivo y así obtener la duración y otros datos
const getMetadatos = async (req, res) => {
    try {
        const metadatosVideo = await cloudinary.getMetadata(req.params.id)
        res.send(metadatosVideo)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los metadatos' });
    }
}

// Este método nos permite crear de un nuevo  objeto del modelo y añadirlo a la base de datos
/*corregir: Al crear un archivo y hacer que este pertenezca a una playlist, 
tenemos que actualizar la duración de la playlist y el valor del array de archivos que contiene, 
añadiendo el nuevo archivo
*/
const createFile = async (req, res) => {

    try {
        //comprobamos que se ha subido un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se ha encontrado ningún archivo.');
        }
        else {
            //recogemos los datos y los asignamos al modelo
            //Corregir: El toLowerCase en caso que el usuario no ponga alguno de los campos
            let nombre = req.body.nombre
            let descripcion = req.body.descripcion
            let ubicacion = req.body.ubicacion
            let playlists = req.body.playlist
            let arrayPlaylist = []

            //parseamos los datos recogidos
            nombre == undefined ? nombre = null : nombre = nombre.toLowerCase();
            descripcion == undefined ? descripcion = null : nombre = nombre.toLowerCase();
            ubicacion == undefined ? descripcion = null : descripcion = descripcion.toLowerCase();

            const nuevoFile = new fileModel({
                nombre: nombre,
                descripcion: descripcion,
                ubicacion: ubicacion
            });

            //Comprobamos que el usuario ingresa el archivo en el campo "archivo" 
            if (req.files?.archivo) {
                let type;

                //detectamos si el usuario esta intentando ingresar una imagen o un video
                //dependiendo del archivo el tipo será un 'video' o 'imagen'
                if (req.files.archivo.mimetype.includes("video")) {
                    type = "video"
                }
                else if (req.files.archivo.mimetype.includes("image")) {
                    type = "image"
                }
                else {
                    //borramos el archivo localmente
                    await fsExtra.unlink(req.files.archivo.tempFilePath)
                    return res.status(404).json({
                        message: 'Archivo no soportado  '
                    })
                }
                /*El video introducido es detectado en los archivos temporales
                y esperamos a que sea subido a cloudinary*/
                const result = await cloudinary.uploadData(req.files.archivo.tempFilePath, type)

                //borramos el archivo localmente
                await fsExtra.unlink(req.files.archivo.tempFilePath)

                //Guardamos el assetID que será usado para obtener la duracion del video en sus metadatos
                const assetID = result.asset_id;

                //Obtenemos los metadatos
                const metadatosVideo = await cloudinary.getMetadata(assetID)
                let duracion;
                //Determinamos el tipo de archivo e indicamos la duración
                if (type === 'video') {
                    duracion = metadatosVideo.video_metadata.format_duration
                } else {
                    duracion = 15
                }
                //recogemos los datos del video subido y se los añadimos al modelo
                nuevoFile.datos = {
                    //Añadimos los siguientes campos, sus valores son obtenidos gracias a los metadatos
                    public_id: result.public_id,
                    url: result.secure_url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    asset_id: result.asset_id,
                    resource_type: result.resource_type,
                    duracion: duracion
                }
                //Funcion nueva para guardar la duración del archivo en la playlist
                if (playlists == undefined | playlists == '') {
                    // playlists=null
                    // nuevoFile.playlist = {
                    //     playlists
                    // }
                } else {
                    playlists = playlists.split(','); // Convertir la cadena de texto en un array
                    try {
                        //recogemos los datos de la duración de cada archivo
                        for (const playlist of playlists) {
                            if (!arrayPlaylist.includes(playlist)) {
                                try {
                                    const query = await playlistModel.findOneAndUpdate(
                                        { _id: playlist },
                                        {
                                            $push: { archivos: nuevoFile._id },
                                            $inc: { duracion: nuevoFile.datos.duracion } // Sumamos la duración del archivo al campo duracion
                                        }
                                    );
                                    if (query) {
                                        arrayPlaylist.push(playlist)
                                        nuevoFile.playlist = query._id
                                    }

                                } catch (error) {
                                    console.error(error)
                                    res.status(500).send(error)
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
            else {
                //si el archivo introducido no se encuentra en el campo 'archivo' o no se introduce ninguno
                return res.status(400).send("Ingrese el archivo en el parámetro 'archivo'")
            }

            //asignamos los datos recogidos al nuevo video y esperamos a que se guarden los datos

            console.log(arrayPlaylist)
            await nuevoFile.save();
            //si todo está bien, nos devuelve los datos subidos
            return res.status(201).json(nuevoFile);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al crear el video' });
    }

}

//Este método nos permite actualizar la información de un objeto de mongo db y al mismo tiempo,
//actualizar el fichero al que se encuntra vinculado en cloudinary
//corregir, eliminar que pueda sustituir el archivo por otro, es mejor que crée un archivo nuevo a modificar uno que ya esté subido

const updateFile = async (req, res) => {
    try {
        //usamos el id proporcionado en la url 
        const filter = { _id: req.params.id }
        let actualizarFile;
        //buscamos en la base de datos la informacion relacionada con el id proporcionado
        const findFile = await fileModel.findOne({ _id: req.params.id });

        //Detectamos si el usuario está intentando sustituir el archivo 
        //vinculado a los datos proporcionados por otro nuevo
        if (req.files?.archivo) {
            let type = findFile.datos.resource_type;

            //Se elimina de cloudinary el archivo antiguo asociado al objeto que vamos a actualizar de mongo
            await cloudinary.deleteFile(findFile.datos.public_id, type)

            /*El video introducido es detectado en los archivos temporales
            y esperamos a que sea subido a cloudinary*/
            const result = await cloudinary.uploadData(req.files.archivo.tempFilePath, type)

            //Obtenemos los metadatos
            const metadatosVideo = await cloudinary.getMetadata(result.asset_id)

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
            return res.status(404).json({
                message: 'Los datos no son correctos'
            })
        }

        // mostramos los datos actualizados al finalizar todas las operaciones
        return res.send(actualizarFile)
    } catch (error) {
        res.status(500).send(error);
    }
}

//Este método nos permite borrar un archivo con el id especificado en la url tanto en mongodb como en cloudinary
/* Corregir:  Tenemos eliminar el archivo de todas las playlist en las que se encuentre y reducir el valoir del campo "duracion"
de la playlist*/
const deleteFile = async (req, res) => {

    try {
        //Busca el archivo con id proporcionado en la base de datos y este es borrado
        const File = await fileModel.findOneAndDelete({ _id: req.params.id });
        let filePlaylists = File.playlist

        //Si el archivo, no existe, se mostrará el siguiente error
        if (!File) return res.status(404).json({
            message: 'No se ha encontrado el video'
        })

        //Detectamos si el tipo de achivo
        let type = File.datos.resource_type

        //Se elimina de cloudinary el archivo asociado al objeto eliminado de mongo
        await cloudinary.deleteFile(File.datos.public_id, type)

        //Eliminamos el archivo de la playlist y restamos la duración
        for (const playlist of filePlaylists) {
            await playlistModel.findOneAndUpdate(
                { _id:  playlist},
                {
                    $pull: { archivos: File._id },
                    $inc: { duracion: -File.datos.duracion } // restamos la duración del archivo al campo duracion
                }
            );
        }
        // mostramos los datos eliminados al finalizar todas las operaciones      
        return res.send(File)

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

//este método descarga todos los videos que pertenezcana la ubicación indicada
const getPlaylist = async (req, res) => {

    try {
        //El parametro req.query devuelve los objetos que coinciden 
        //con los parametros solicitados por el usuario
        let ubicacion = req.query.ubicacion
        let lowerUbicacion = ubicacion.toLowerCase()

        const file = await fileModel.find({ ubicacion: lowerUbicacion });
        if (file.length >= 1) {
            // Crear un objeto Archiver para el archivo ZIP
            const zip = archiver('zip', {
                zlib: { level: 9 } // Nivel de compresión
            });
            // Configurar la respuesta HTTP para que el navegador descargue el archivo ZIP
            res.attachment('playlist.zip');
            zip.pipe(res);
            for (const files of file) {
                const url = files.datos.url;
                const nombre = files.nombre;
                const extension = files.datos.format;
                //usamos axios para realizar peticiones a las urls
                const response = await axios.get(url, { responseType: 'stream' });
                const nombreArchivo = `${nombre}.${extension}`;
                zip.append(response.data, { name: nombreArchivo });
            }
            // Finalizar el archivo ZIP y enviarlo
            zip.finalize();

        } else {
            return res.status(300).send('No se han encontrado archivos')
        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


module.exports = { getFile, updateFile, deleteFile, createFile, getFiles, getMetadatos, getPlaylist }