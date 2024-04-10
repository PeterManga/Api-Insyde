const fs = require('fs')
const https = require('https');
const http = require('http');
// const carpetaArchivos = require('../files')
const url = require('url');
const { response } = require('../app');

const extension = 'mp4'
const folder = `./files/file.${extension}`

const file = fs.createWriteStream(folder)

function fileDowloader(url, fileName) {
    console.time('time dowloading video');
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

module.exports = {
    fileDowloader: fileDowloader
}