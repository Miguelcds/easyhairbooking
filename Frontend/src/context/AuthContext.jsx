import { createContext, useState, useContext, useEffect } from "react";

import { getMeService, logoutService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // Verificar si token en cookie es valido todavia

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await getMeService();
        setUser(data) // Seteo el user con el data en este momento, por si modifican el localStorage manualmente, no pedan acceder a endpoits de Admin (Igualmente no podrian obtener informacion del server, solo accederiana la parte visual)
      } catch (error) { // En caso de que hubiera expirado elimino todos los datos del local storage para no iniciar sesion
        localStorage.removeItem("user"); 
        setUser(null);
        console.error(error);
      }
    };
    verify();
  }, []);

  /* 
    Para la persistencia del token se ha utilizado httpOnly cookies, para prevenir ataques XSS
    Se almacenara datos de caracter poco relevante en el Local Storage.

  */

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    await logoutService()
    setUser(null)
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
