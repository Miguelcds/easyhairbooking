const User = require("../api/models/user.model");

const { verifyToken } = require("../utils/token"); // Pendiente De Escritura

const isAuth = (allowedRoles = []) => {
  return async (req, res, next) => {

    try {
        
    // Leer el Token Del Header --> Viene en este formato (Value: Bearer eyJhbGciOiJIUzI1NiJ9...)

    const token = req.headers.authorization?.replace("Bearer ", ""); // Remplazamos el Texto y el espacio y lo dejamos vacio

    if (!token) {
      return res.status(401).json("No Autorizado: Token no proporcionado");
    }

    // Verificamos el Token, Para ello traemos la funcion de utils

    const decoded = verifyToken(token);

    // Buscar al usuario usando la clave secreta

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json("Token inválido o usuario no encontrado");
    }

    // Guardamos la info del usuario en la Peticion

    req.user = user;

    // Si hay roles Definidos

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return res.status(403).json("Acceso denegado: permisos insuficientes");
    }

    // Si Todo esta Ok, continuamos 

    next()

    } catch (error) {
        console.error(error);
        return res.status(401).json("Token inválido o sesión expirada");
    }
  };
};

module.exports = { isAuth };
