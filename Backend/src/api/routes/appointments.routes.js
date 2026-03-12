const express = require("express");

const {bookAppointment, changeAppointment, getAppointmentsAdmin, getAppointmentsClient} = require('../controllers/appointment.controller');

const {isAuth} = require("../../middlewares/auth.middleware");


const appointmentRouter = express.Router();

appointmentRouter.post("/",isAuth(["client", "admin"]),bookAppointment)

appointmentRouter.patch("/:id", isAuth(["client", "admin"]), changeAppointment)

appointmentRouter.get("/my",isAuth(["client", "admin"]),getAppointmentsClient)

appointmentRouter.get("/",isAuth(["admin"]),getAppointmentsAdmin)



module.exports = appointmentRouter

