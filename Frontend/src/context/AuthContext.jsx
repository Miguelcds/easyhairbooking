import { createContext, useState, useContext} from "react"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

    /* 
    Para la persistencia del token se ha utilizado localStorage por simplicidad en el contexto académico. En un entorno de producción real se recomienda el uso de httpOnly cookies para prevenir ataques XSS
    */

    const login = (userData, token) => {
        setUser(userData)
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }


    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )


}


export const useAuth = () => useContext(AuthContext);