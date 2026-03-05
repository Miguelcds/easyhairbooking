const mongoose = require("mongoose");

const bcrypt = require("bcrypt"); // Libreria Encriptacion
const { use } = require("react");

/* 
* Type:
* Trim:
* Require:
*
*
*



*/

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, require: true, minLength: 5 },
    email: { type: String, trim: true, require: true, unique: true },
    password: {
      type: String,
      trim: true,
      require: true,
      minLength: [8, "La contraseña tiene que tener al menos 8 caracteres"],
    },
    role: { type: String, enum: ["admin", "user"], default: "user" }, // // Para Facilitar esta parte: El primer admin se insertará manualmente modificando el documento directamente en MongoAtlas. Podrá tener el rol “admin”
  },
  {
    timestamps: true,
  },
);
