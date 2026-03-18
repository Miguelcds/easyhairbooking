import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const {logout} = useAuth()

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }


  return (
    <div>
      <h1>Dasboard</h1>
      <h2>Bienvenido, Aqui irá el nombre de la persona ➡️ {} </h2>

      <h3>Si estas aqui es porque has iniciado sesion !</h3>

      <button onClick={handleLogout}>Logout</button>


    </div>
  )
}

export default Dashboard