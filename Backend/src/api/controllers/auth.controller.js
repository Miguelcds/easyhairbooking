const User = require('../models/user.model')

const bcrypt = require("bcrypt");

const {generateToken} = require('../../utils/token')

// Registrar Usuario


const registerUser = async (req, res) => {
    try {
        const userData = new User(req.body)

        // Verificar que los Datos ya existen o ya esta registrado // La Propia BBDD tambien tiene ya ese parametro de Verificacion

        const userExist = await User.findOne({email:userData.email})

        if (userExist) {
            return res.status(400).json({error: "El usuario ya existe"});
        }

        // Si no existe y los datos estan verificados guardamos el Usuario en la BBDD

        const userDB = await userData.save();

        // Filtro los datos, usando destructuring de Forma que la respuesta no incluya la contraseña

        const {password, ...userWhitoutPassword} = userDB.toObject();

        // Devolvemos Confirmacion y los datos Registrados

        res.status(201).json(userWhitoutPassword);


    } catch (error) {
        res.status(400).json({error:"Error Registrando el Usuario"})
        console.error(error); 
    }
}


const loginUser = async (req, res) => {
    try {

        // Buscar El Email en el body 

        const user = await User.findOne({email:req.body.email})

        // Si ya no existe el Email, devolvelos error (ojo, ese error no puede dar pista de si lo que esta mal es el usuario o la contraseña)

        if(!user){
            return res.status(400).json("Contraseña o usuario incorrecto")
        }

        // Si lo anterior es Correcto, comparamos la Contraseña con la de la BBDD

        const validPassword = await bcrypt.compare(req.body.password, user.password)

        // Si la Contraseña no es correcta Arrojamos el error (ojo, lo mismo que la anterior verficacion, no arrojamos pista de cuál de las dos a puesto mal)

        if(!validPassword){
            return res.status(400).json("Contraseña o usuario incorrecto")
        }

        // Si todo a salido Bien, Generamos un token al Usuario, el cual sera usado en las validaciones de acceso a las rutas

        const token = generateToken(user._id, user.role);


        // Potegemos el Token para mandarlo mediante una cookie 

        res.cookie("token", token, {
            httpOnly:true,
            secure: false, // En desarrolo false, en produccion true
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 dias

        })

        // Devolvemos el Token y algunos Datos Basicos

        return res.status(200).json({user: user.name, email: user.email})
        
    } catch (error) {
        res.status(400).json("Error en el login");
        console.error(error);
    }
}


module.exports ={registerUser, loginUser};