const express = require('express');
const router = express.Router();
const calendarController = require('../controller/calendar.controller')

//rutas get
router.get('/calendars', calendarController.getAllCalendars);
router.get('/calendar/:id', calendarController.getCalendar)

//rutas post
router.post('./calendar', calendarController.createCalendar)

//rutas update
router.put('/calendar/:id', calendarController.updateCalendar)

//rutas delete
router.delete('/calendar/:id', calendarController.deleteCalendar)