import React, { useState } from "react";
import { useForm, Watch } from "react-hook-form";
import { registerService } from "../services/auth.service";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    formState,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password")

  return (
    <>
      <div>
        <h1>Registro</h1>
      </div>
      <form onSubmit={handleSubmit(registerService)}>
        {/* Campo Nombre */}
        <label htmlFor="name">
          Nombre Usuario:
          <input
            placeholder="Alex Garcia..."
            type="text"
            id="name"
            {...register("name", {
              required: "El nombre es Obligatorio",
              minLength: {
                value: 2,
                message: "Debe tener al menos 2 caracteres",
              },
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message: "No puede contener Numeros",
              },
              validate: (value) =>
                value.trim().length >= 2 || "No pueden ser solo espacios",
            })}
          />
          {errors.name && (
            <p style={{ color: "red" }}> {errors.name.message}</p>
          )}
        </label>

        {/* Campo Contraseña */}

        <label htmlFor="password">
          Contraseña:
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "No has introducido Ninguna contraseña",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  "La contraseña debe incluir números, letras Mayúsculas y minúsculas y como minimo 8 caracteres",
              },
            })}
          />
        </label>
        <label htmlFor="confirmPassword">
          Repite La Contraseña:
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required:
                "No Has introducido Ningun Valor para validar la contraseña",
              validate: (value) =>
                value === getValues("password") ||
                "Las Contraseñas no son iguales",
            })}
          />
          {errors.password && (
            <p style={{ color: "red" }}> {errors.password.message}</p>
          )}
          {errors.confirmPassword && (
            <p style={{ color: "red" }}> {errors.confirmPassword.message}</p>
          )}
        </label>

        {/* Campo Email */}

        <label htmlFor="email">
          Email:
          <input
            placeholder="alex@gmail.com"
            type="email"
            id="email"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Formato Del Email No valido",
              },
            })}
          />
          {errors.email && (
            <p style={{ color: "red" }}> {errors.email.message}</p>
          )}
        </label>

        <label htmlFor="confirmEmail">
          Confirmar Email:
          <input type="email" id="confirmPassword" />
        </label>
      </form>
    </>
  );
};

export default Register;
