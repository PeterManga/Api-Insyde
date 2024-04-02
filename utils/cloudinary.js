const app = require('../app')
require('dotenv').config();
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
  });

async function uploadData(filePath){
    return await cloudinary.uploader.upload(filePath,{
        folder: "Archivos"
    })
}

async function getDuration(public_id){
    return await cloudinary.api.resource_by_asset_id(public_id,{
        media_metadata: true
    })

    
}
const apiCloudinary=cloudinary.api

module.exports = {
    uploadData: uploadData, getDuration:getDuration, apiCloudinary
};