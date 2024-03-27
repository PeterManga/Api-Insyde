const getImage = (req, res)=>{
    res.send('Obteniendo images');
}

const createImage = (req, res)=>{
    res.send('Creando images');
}

const updateImage = (req, res)=>{
    res.send('Actulizando images');
}

const deleteImage = (req, res)=>{
    res.send('Eliminando images');
}

module.exports = {getImage,updateImage,deleteImage,createImage}