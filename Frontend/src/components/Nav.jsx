import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const withOutLogin = !user;
  const withRoleUser = user?.role === "client";
  const withRoleAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };



  return (
    <>
      {withOutLogin && (
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>
      )}
      {withRoleUser && (
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/employees">Citas Disponible</NavLink>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </nav>
      )}
      {withRoleAdmin && (
        <nav>
          <NavLink to="/dashboard">Citas Telefonicas</NavLink>{" "}
          {/* Pendiente Implementar, de momento solo puede realizar citas con nombre de admin */}
          <NavLink to="/admin">Panel Administrador</NavLink>
          <NavLink to="/admin/employees">Gestion Empleados</NavLink>
          <NavLink to="/admin/slots">Creacion Citas</NavLink>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </nav>
      )}
    </>
  );
};

export default Nav;
