// Traer Mongoose

const mongoose = require("mongoose");


// Funcion Async para coneccion con MongoDB 

const connectDB = async () => {

    // Try-Catch para controlar erres De Conexion

    try {
        //Esperamos a establecer conexion con la BBDD y recogemos el archivo de env con dotenv
        await mongoose.connect(process.env.DB_URL)
        console.log("Conectado Con la BBDD");
        
    } catch (error) {
        console.log("Error al Conectarse con la BBDD"); 
        console.error(error);
         
    }
}


module.exports = {connectDB}