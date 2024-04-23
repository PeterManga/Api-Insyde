const calendarModel = require('../models/calendar.model')
// Esta función devuelve todos los calendarios que se cuentran disponibles en la base de datos
const getAllCalendars = async (req, res) => {
    try {
        let result = calendarModel.find();
        res.status(200).send(result)
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }

}
//Esta función nos permite obtener todos los datos de un calendario con el id proporcionadao por el usuario
const getCalendar = async (req, res) => {
    try {
        const result = calendarModel.findOne({ _id: req.params.id });
        if (!result) {
            res.status(404).json({
                messsage: 'El calendario especificado no existe'
            })
        }
        else {
            res.status(200).send(result)
        }

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

// Esta función nos permite crear un nuevo calendario
const createCalendar = async (req, res) => {
    try {
        let nombre = req.body.nombre;
        let playlist = req.body.playlist;
        let fechainicio = req.body.fechainicio

        const result = new calendarModel({
            nombre: nombre,
            playlist: playlist,
            fechainicio: fechainicio
        })
        res.status(200).send(result)

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

// Esta función elimina el calendario con idproporcionada por el usuario
const deleteCalendar = async(req,res)=>{
    try {
        const result = calendarModel.findOneAndDelete({_id: req.params.id})
        if(!result){
            res.status(404).res('No se encuentra el calendario')
        }
        res.status(200).send(result)
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
}
// Función para actualizar el calendario y las playlist que componen este calendario
const updateCalendar = async(req,res)=>{
    try {
        let nombre = req.body.nombre;
        let playlist = req.body.playlists;
        let fechainicio = req.body.fechainicio;
        let filter = { _id : req.params.id}
        let update
        
        if (playlist) {
            update={
                nombre: nombre,
                fechainicio: fechainicio,
                playlist: playlist
            }
        }
        else{
            update={
                nombre: nombre,
                fechainicio: fechainicio,
            }
        }
        const result = calendarModel.findOneAndUpdate(filter, update,{
            new: true
        })

        res.status(200).send(result)

        
    } catch (error) {
        
    }
}
module.exports = { getAllCalendars, getCalendar, createCalendar, deleteCalendar, updateCalendar }