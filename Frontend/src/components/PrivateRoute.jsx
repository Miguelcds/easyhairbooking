import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({children, allowedRoles = []}) => {

    const {user} = useAuth()

    if(!user){
        return <Navigate to="/login" />
    }
   
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />
    }

    return children
}

export default PrivateRoute