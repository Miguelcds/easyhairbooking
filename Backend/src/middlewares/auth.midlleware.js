const User = require('../api/models/user.model')


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





module.exports ={registerUser}