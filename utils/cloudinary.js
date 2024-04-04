const app = require('../app')
require('dotenv').config();
const cloudinary = require('cloudinary').v2
// Datos necesarios para el correcto funcionamiento de la api cloudinary
// Los datos están protegidos en el archivo ".env"
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
  });

// Función para subir archivos a cloudinary
async function uploadData(filePath,type){
    return await cloudinary.uploader.upload(filePath,{
        folder: "Archivos",
        resource_type: type
    })
    
}
//Función para borrar los archivos de cloudinary
async function deleteFile(public_id, type){
    return await cloudinary.uploader.destroy(public_id,{
        resource_type: type
    })
    
}

// Funcion para obtener la duración de un video
async function getDuration(public_id){
    return await cloudinary.api.resource_by_asset_id(public_id,{
        media_metadata: true
    })   
}

//funcion experimental para añadir la duracion a un video que acabamos de crear
async function addDuration(public_id){
    var longitud_video;
    const duration = await getDuration(public_id)
    longitud_video=duration.video_metadata.format_duration
    return longitud_video

}
//exportamos las funciones
module.exports = {
    uploadData: uploadData, getDuration:getDuration, deleteFile:deleteFile, addDuration:addDuration
};