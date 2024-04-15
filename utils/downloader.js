//importamos los componentes necesarios
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const archiver = require('archiver')

//url y puerto del servidor
const baseUrl = 'http://localhost:3000/';

//Esta función realiza una petición a nuestra api y nos devuelve un array 
//con objetos que coinciden con los parámetros proporcionados
async function getFiles(ubicacion) {
    const response = await axios.get(`${baseUrl}files?ubicacion=${ubicacion.toLowerCase()}`);
    return response.data
}


// esta función se encarga de mandar cada objeto 
// recuperado a de la api para que su respectivo video sea descargado
// usando la funcion fileDownloader
async function playListDownloader(ubicacion) {
    const datos = await getFiles(ubicacion);
    for (const element of datos) {
        const url = element.datos.url;
        const nombre = element.nombre;
        const extension = element.datos.format;
        const file = `./files/${nombre}.${extension}`;
        
        //comprobamos que el archivo existe
        try {
            await fs.promises.access(file, fs.constants.F_OK);
            console.log('El archivo existe');
        } catch (err) {
            console.error('El archivo no existe');
            await fileDowloader(extension, url, nombre);
           //Crear un objeto Archiver
            const zip = archiver('zip')
            //configurar la respuesta http para que el navegador descargue el archivo
            
        }
    }
    console.log('Descargas finalizadas');
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