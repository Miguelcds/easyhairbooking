// Traer Mongoose

const mongoose = require("mongoose");


// Funcion Async para coneccion con MongoDB 

const connectDB = async () => {

    // Try-Catch para controlar erres De Conexion

    try {

        await mongoose.connect()
    } catch (error) {
        
    }
}