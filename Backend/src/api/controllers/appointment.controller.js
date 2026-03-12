const mongoose = require("mongoose");
const Appointment = require("../models/appointment.model");
const Slot = require("../models/slot.model");
const User = require("../models/user.model");

// Reservar

const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { slot_id, service, price } = req.body;

    const client_id = req.user._id;

    const actualState = await Slot.findById(slot_id, null, { session });

    if (!actualState.isAvailable) {
      return res.status(400).json("La Reserva ya no esta disponible");
    }

    const slot = await Slot.findByIdAndUpdate(
      slot_id,
      {
        $set: { isAvailable: false },
      },
      { session },
    );

    const appointment = new Appointment({
      client_id: client_id,
      slot_id: slot_id,
      service: service,
      price: price,
    });

    await appointment.save({ session });

    res
      .status(201)
      .json({ "Cita Creada con los siguientes datos: ": appointment });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Error Creando la Cita" });
    console.error(error);
  } finally {
    session.endSession();
  }
};

const changeAppointment = async (req, res) => {
  try {
    const { slot_id, state } = req.body;
    const user = req.user;
    const { id } = req.params;

    if (user.role === "client") {
      await Slot.findByIdAndUpdate(slot_id, {
        $set: { isAvailable: true },
      });

      await Appointment.findByIdAndUpdate(id, {
        $set: { state: "cancelled" },
      });

      return res.status(200).json("Cancelado con exito");
    }

    if (user.role === "admin") {
      if (state === "confirmed") {
        await Appointment.findByIdAndUpdate(id, {
          $set: { state: "confirmed" },
        });
        return res.status(200).json("Confirmado con Exito");

      } else {

        await Slot.findByIdAndUpdate(slot_id, {
          $set: { isAvailable: true },
        });

        await Appointment.findByIdAndUpdate(id, {
          $set: { state: "cancelled" },
        });

        return res.status(200).json("Cancelado con exito");
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Error Creando la Cita" });
    console.error(error);
  }
};





module.exports = {bookAppointment, changeAppointment};