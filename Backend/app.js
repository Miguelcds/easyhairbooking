// Traer Libreria Dotenv para acceder a variables de entorno, como la del .env, es decir, importar y arrancar
require("dotenv").config();


// Traemos de .env el puerto y lo metemos en una constante
const PORT = process.env.PORT || 3000;


// Traer el modulo de configuracion de Express

const express = require("express");

const {connectDB} = require('./src/config/db');

// Para que Permitir el navegador acepte peticines de origenes Diferentes 

const cors = require("cors")


// Conectamos la BBDD

connectDB();



// Guardar y ejecutar en una variable la libreria de Express

const app = express();

// Indicamos a express que use su funcion para trabjar con archivos JSON
app.use(express.json())

// 

app.use(express.urlencoded({extended:false}))


// Indicamos al navegador que aceptamos las peticiones de la un puerto diferente


app.use(cors({
    origin:process.env.FRONTEND_URL
}));



// Probamos Ruta Para Probar Funcionamineto

app.use("/test", (req, res) => {
    res.status(200).json({test: "Todo Ok "})
})




// Las Rutas Sin Respuesta Seran Redirigidas

app.use((req,res) => {
    res.status(404).json({error:"Route Not Found"});
})

// Las Funcioes que lancen algun Error

app.use((error, req, res, next)=>{
  return res.status(error.status || 500).json(error.message || "Unexpected error")
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})