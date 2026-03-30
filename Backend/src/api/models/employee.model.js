const mongoose = require("mongoose");
//let validator = require('validator')

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, minlength: 2 },
    specialty: {
      type: [String],
      required: [true, "Debes añadir al menos una especialidad"],
      validate: {
        validator: function(value) {
          return Array.isArray(value) && value.length > 0
        },
        message: "No has introducido Ninguna especialidad"
      },
    },
    active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
