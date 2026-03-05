const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Libreria Encriptacion

/* 
* Type:
* Trim:
* Require:
* minLength:
* 
*
*/

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, minlength: 5 },
    email: { type: String, trim: true, required: true, unique: true },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [8, "La contraseña tiene que tener al menos 8 caracteres"],
    },
    profileImgUrl: {type:String , default:"" }, // Pondre Cuando Este Con la Parte Claudinary
    profileImgId:{type:String, trim:true},
    role: { type: String, enum: ["admin", "client"], default: "client" }, // // Para Facilitar esta parte: El primer admin se insertará manualmente modificando el documento directamente en MongoAtlas. Podrá tener el rol “admin”
  },
  {
    timestamps: true,
  },
);


// Funcion Para hashear Contraseña, pendiente Cuando toque

// userSchema.pre()



const User = mongoose.model("User", userSchema);

module.exports = User;