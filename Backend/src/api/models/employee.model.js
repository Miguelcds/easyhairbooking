const mongoose = require("mongoose");
//let validator = require('validator')

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, minlength: 2 },
    specialty: {
      type: [String],
      required: true,
      validate: {
        validator: function(value) {
          return value.length > 0
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
