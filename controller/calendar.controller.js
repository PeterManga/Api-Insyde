const calendarModel = require('../models/calendar.model.js')


// Esta función nos permite crear un nuevo calendario
const createCalendar = async (req, res) => {
    try {
        let nombre = req.body.nombre;
        let playlist = req.body.playlist;
        let player = req.body.player;

        // let fechainicio = req.body.fechainicio
        // let fechafin = req.body.fechainicio

        const result = new calendarModel({
            nombre: nombre,
            playlist: playlist,
            player: player
        })
        await result.save();
        console.log(result)
        res.status(200).send(result)

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
}

// Esta función devuelve todos los calendarios que se cuentran disponibles en la base de datos
const getAllCalendars = async (req, res) => {
    try {
        let result = await calendarModel.find();
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


//Esta funcion nos permite encontrar ecentos segun el el player
const findCalendarByPlayer = async (req, res) => {
    try {
        let playerId = req.query.player;

        // Filtrar los calendarios por el ID del player
        const result = await calendarModel.find({ 'player': playerId })
            .populate('player') // Poblar el campo 'player'
        // .populate('playlist'); // Poblar el campo 'playlist'
        console.log(result);
        res.status(200).json(result); // Usar .json() para enviar la respuesta
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
// Esta función elimina el calendario con id proporcionada por el usuario
const deleteCalendar = async (req, res) => {
    try {
        let id = req.params.id
        const result = await calendarModel.findOneAndDelete({ _id: id })
        if (!result) {
            res.status(404).res('No se encuentra el calendario')
        }
        res.status(200).send(result)
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
}
// Función para actualizar el calendario y las playlist que componen este calendario
const updateCalendar = async (req, res) => {
    try {
        let nombre = req.body.nombre;
        let playlist = req.body.playlists;
        let fechainicio = req.body.fechainicio;
        let filter = { _id: req.params.id }
        let update

        if (playlist) {
            update = {
                nombre: nombre,
                fechainicio: fechainicio,
                playlist: playlist
            }
        }
        else {
            update = {
                nombre: nombre,
                fechainicio: fechainicio,
            }
        }
        const result = calendarModel.findOneAndUpdate(filter, update, {
            new: true
        })

        res.status(200).send(result)


    } catch (error) {

    }
}


// Función para obtener el evento activo en la fecha actual
const getActiveEvent = async (req, res) => {
    try {
        const currentDate = new Date();

        // Consultar el evento que está activo en la fecha actual
        const activeEvent = await calendarModel.findOne({
            fechaInicio: { $lte: currentDate },
            fechaFin: { $gte: currentDate }
        }).populate('player').populate('playlist');

        if (activeEvent) {
            res.status(200).json(activeEvent);
        } else {
            res.status(404).json({ message: 'No active event found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


module.exports = { getAllCalendars, getCalendar, createCalendar, deleteCalendar, updateCalendar, findCalendarByPlayer, getActiveEvent }