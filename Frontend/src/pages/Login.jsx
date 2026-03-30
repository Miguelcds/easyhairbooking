import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginService } from "../services/auth.service";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroBg from "../assets/HomePage.png";
import "../Styles/AuthPages.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const userData = await loginService({ email: data.email, password: data.password });
      login(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data || "Credenciales incorrectas. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      {/* Fondo imagen */}
      <div className="auth__bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="auth__overlay" />

      <div className="auth__container">
        {/* Branding */}
        <div className="auth__brand">
          <NavLink to="/" className="auth__logo">
            Easy<em>Hair</em>
          </NavLink>
          <p className="auth__brand-tagline">La excelencia te espera</p>
        </div>

        {/* Card */}
        <div className="auth__card">
          <div className="auth__card-header">
            <p className="text-eyebrow">Bienvenido de vuelta</p>
            <h1 className="auth__title">Iniciar <em>Sesión</em></h1>
          </div>

          {errorMsg && (
            <div className="alert alert--error">
              {errorMsg}
            </div>
          )}

          <form className="auth__form" onSubmit={handleSubmit(submit)}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                className={`form-input ${errors.email ? "form-input--error" : ""}`}
                placeholder="tu@email.com"
                type="email"
                id="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de email no válido",
                  },
                })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                className={`form-input ${errors.password ? "form-input--error" : ""}`}
                type="password"
                id="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className={`btn btn--primary auth__submit ${loading ? "btn--loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Accediendo..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth__footer">
            <p className="auth__footer-text">
              ¿No tienes cuenta?{" "}
              <NavLink to="/register" className="auth__footer-link">
                Regístrate
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;