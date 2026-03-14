import { useForm } from "react-hook-form";
import { registerService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState(null);

  const [success, setSuccess] = useState(false);

  //const {login} = useAuth()

  const submit = async (data) => {
    try {
      await registerService({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  return (
    <>
      <div>
        <h1>Registro</h1>
      </div>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {success ? (
        <div>
          <h2>✅ Usuario creado con éxito</h2>
          <button onClick={() => navigate("/login")}>Ir al Login</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)}>
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
            {errors.password && (
              <p style={{ color: "red" }}> {errors.password.message}</p>
            )}
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
            <input
              type="email"
              id="confirmEmail"
              {...register("confirmEmail", {
                required: "La Confirmacion del Email es Obligatoria",
                validate: (value) =>
                  value === getValues("email") || "Los emails no coinciden",
              })}
            />
            {errors.confirmEmail && (
              <p style={{ color: "red" }}> {errors.confirmEmail.message}</p>
            )}
          </label>

          <button type="submit">Registrarse</button>
        </form>
      )}
    </>
  );
};

export default Register;

/*
name: Pedro Perez

contraseña: PedroPorro11

correo: pedro@hotmail.com


*/

/*
name: Paco Perez

contraseña: PocoPorro11

correo: paco@hotmail.com


*/


