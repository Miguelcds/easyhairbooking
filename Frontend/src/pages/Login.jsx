import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const { login } = useAuth();

  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const submit = async (data) => {
    try {
      const { token, ...userData } = await loginService({
        email: data.email,
        password: data.password,
      });

      login(userData, token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  return (
    <>
      <div>
        <h1>Login</h1>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <label htmlFor="email">
          Email:
          <input
            placeholder="alex@gmail.com"
            type="email"
            id="email"
            {...register("email", {
              required: "No has introducido Ningun email",
              pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "El formato introducido de email es incorrecto, por favor, introducelo correctamente",
                },
            })}
          />
          {errors.email && (
            <p style={{ color: "red" }}> {errors.email.message}</p>
          )}
        </label>
        <label htmlFor="password">
          Contraseña:
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "No has introducido Ninguna contraseña",
            })}
          />
          {errors.password && (
            <p style={{ color: "red" }}> {errors.password.message}</p>
          )}
        </label>
        <button type="submit">Login</button>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </form>
    </>
  );
};

export default Login;
