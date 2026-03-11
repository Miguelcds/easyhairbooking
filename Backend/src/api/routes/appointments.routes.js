const express = require("express");

const {bookAppointment, changeAppointment} = require('../controllers/appointment.controller');

const {isAuth} = require("../../middlewares/auth.middleware");


const appointmentRouter = express.Router();

appointmentRouter.post("/",isAuth(["client", "admin"]),bookAppointment)

appointmentRouter.patch("/:id", isAuth(["client", "admin"]), changeAppointment)

module.exports = appointmentRouter

