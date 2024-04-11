const fs = require('fs');
const https = require('https');
const url = require('url');
const axios = require('axios');

//url y puerto del servidor
const baseUrl = 'http://localhost:3000/';

async function getFiles(ubicacion){
    const response = await axios.get(`${baseUrl}files?ubicacion=${ubicacion.toLowerCase()}`);
    return response.data
}


// esta función se encarga de mandar cada objeto 
//recuperado a de la api para que su respectivo video sea descargado
// usando la funcion fileDownloader
async function playListDownloader(){
    let url, extension, nombre
    const datos=await getFiles('gandia')
    datos.forEach(element => {
        //console.log(element.datos.url)
        url = element.datos.url
        nombre = element.nombre
        extension = element.datos.format
        fileDowloader(extension,url,nombre)
    });
    console.log('descargas finalizadas')
}

//Esta función se encarga de descargar el archivo mediante la URL proporcionada, nombre y extesnsión
//este archivo es guardado en la carpeta /files + nombre del archivo
async function fileDowloader(extension, url, nombre) {
    const folder = `./files/${nombre}.${extension}`
    const file = fs.createWriteStream(folder)
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(function () {
                console.log(`Archivo descargado en: ${folder}`);
            });
        });
    }).on('error', function (error) {
        fs.unlink(folder); // Eliminar el archivo descargado en caso de error
        console.error(`Error al descargar el archivo: ${error.message}`);
    });

}

//exportamos lo módulos
module.exports = {
    fileDowloader, getFiles, playListDownloader
}