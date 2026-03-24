import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import "../styles/Nav.css";

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const withOutLogin = !user;
  const withRoleUser = user?.role === "client";
  const withRoleAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : "navbar--transparent"}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          Easy<em>Hair</em>
        </NavLink>

        {/* Desktop links */}
        <nav className="navbar__links">
          {withOutLogin && (
            <>
              <NavLink to="/" end className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Home
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                <span className="btn btn--primary btn--sm">Reservar</span>
              </NavLink>
            </>
          )}

          {withRoleUser && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Dashboard
              </NavLink>
              <NavLink to="/employees" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Reservar Cita
              </NavLink>
              <button className="navbar__link navbar__logout" onClick={handleLogout}>
                Salir
              </button>
            </>
          )}

          {withRoleAdmin && (
            <>
              <NavLink to="/admin" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Panel
              </NavLink>
              <NavLink to="/admin/employees" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Empleados
              </NavLink>
              <NavLink to="/admin/slots" className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}>
                Slots
              </NavLink>
              <button className="navbar__link navbar__logout" onClick={handleLogout}>
                Salir
              </button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        {withOutLogin && (
          <>
            <NavLink to="/" end className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Login</NavLink>
            <NavLink to="/register" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Reservar</NavLink>
          </>
        )}
        {withRoleUser && (
          <>
            <NavLink to="/dashboard" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/employees" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Reservar Cita</NavLink>
            <button className="navbar__mobile-link navbar__logout" onClick={handleLogout}>Salir</button>
          </>
        )}
        {withRoleAdmin && (
          <>
            <NavLink to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Panel</NavLink>
            <NavLink to="/admin/employees" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Empleados</NavLink>
            <NavLink to="/admin/slots" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Slots</NavLink>
            <button className="navbar__mobile-link navbar__logout" onClick={handleLogout}>Salir</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Nav;