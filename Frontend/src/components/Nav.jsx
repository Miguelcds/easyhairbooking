import React from "react";
import {NavLink } from "react-router-dom";

const Nav = () => {


    



  return (
    <>
      {withOutLogin && (
        <nav>
          <NavLink to="Home">Home</NavLink>
          <NavLink to="Login">Login</NavLink>
          <NavLink to="Register">Register</NavLink>
        </nav>
      )}
      {withRoleUser && (
        <nav>
          <NavLink to="Dashboard">Dashboard</NavLink>
          <NavLink to="Employees">Citas Disponible</NavLink>
          <NavLink to="Logout">Cerrar Sesion</NavLink>
        </nav>
      )}
      {withRoleAdmin && (
        <nav>
          <NavLink to="Dashboard">Citas Telefonicas</NavLink> {/* Pendiente Implementar, de momento solo puede realizar citas con nombre de admin */}
          <NavLink to="Admin">Panel Administrador</NavLink>
          <NavLink to="AdminEmployees">Gestion Empleados</NavLink>
          <NavLink to="AdminSlots">Creacion Citas</NavLink>
          <NavLink to="Logout">Cerrar Sesion</NavLink>
        </nav>
      )}
    </>
  );
};

export default Nav;
