const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    slot_id: { type: mongoose.Types.ObjectId, required: true, ref: "Slot" },
    service: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    state:{type: String, required:true, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
  },
  {
    timestamps: true,
  },
);


const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;