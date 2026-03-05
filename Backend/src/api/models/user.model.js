const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Libreria Encriptacion
let validator = require('validator')

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
    name: { type: String, trim: true, required: true, minlength: 2 },
    email: { 
      type: String,
      trim: true, 
      required: true, 
      unique: true,
      validate: (value) => {
        return validator.isEmail(value)
      }
    },
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


// Funcion Para hashear Contraseña, Antes de guardar en BD, la contraseña tiene que transformarse en algo ilegible, y eso solo debe pasar si el campo cambió

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})



const User = mongoose.model("User", userSchema);

module.exports = User;