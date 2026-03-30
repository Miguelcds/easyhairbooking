import { useForm } from "react-hook-form";
import { registerService } from "../services/auth.service";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import heroBg from "../assets/EasyHairDates.png";
import "../styles/AuthPages.css";

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
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await registerService({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="auth__overlay" />

      <div className="auth__container">
        {/* Branding */}
        <div className="auth__brand">
          <NavLink to="/" className="auth__logo">
            Easy<em>Hair</em>
          </NavLink>
          <p className="auth__brand-tagline">Tu primera cita te espera</p>
        </div>

        {/* Card */}
        <div className="auth__card">
          <div className="auth__card-header">
            <p className="text-eyebrow">Empieza ahora</p>
            <h1 className="auth__title">Crear <em>Cuenta</em></h1>
          </div>

          {errorMsg && (
            <div className="alert alert--error">{errorMsg}</div>
          )}

          {success ? (
            <div className="auth__success">
              <span className="auth__success-icon">✅</span>
              <h3 className="auth__success-title">¡Cuenta creada!</h3>
              <p className="auth__success-text">
                Tu cuenta ha sido creada correctamente.
                Ya puedes iniciar sesión y reservar tu primera cita.
              </p>
              <button
                className="btn btn--primary auth__submit"
                onClick={() => navigate("/login")}
              >
                Ir al Login
              </button>
            </div>
          ) : (
            <form className="auth__form" onSubmit={handleSubmit(submit)}>

              {/* Nombre */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre</label>
                <input
                  className={`form-input ${errors.name ? "form-input--error" : ""}`}
                  placeholder="Alex García"
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                      message: "Solo letras, sin números",
                    },
                    validate: (v) => v.trim().length >= 2 || "No pueden ser solo espacios",
                  })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
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

              {/* Confirmar Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirmEmail">Confirmar Email</label>
                <input
                  className={`form-input ${errors.confirmEmail ? "form-input--error" : ""}`}
                  placeholder="tu@email.com"
                  type="email"
                  id="confirmEmail"
                  {...register("confirmEmail", {
                    required: "Confirma tu email",
                    validate: (v) => v === getValues("email") || "Los emails no coinciden",
                  })}
                />
                {errors.confirmEmail && <p className="form-error">{errors.confirmEmail.message}</p>}
              </div>

              {/* Contraseña */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  className={`form-input ${errors.password ? "form-input--error" : ""}`}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                      message: "Mínimo 8 caracteres, mayúscula, minúscula y número",
                    },
                  })}
                />
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              {/* Confirmar Contraseña */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Repetir Contraseña</label>
                <input
                  className={`form-input ${errors.confirmPassword ? "form-input--error" : ""}`}
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (v) => v === getValues("password") || "Las contraseñas no coinciden",
                  })}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                className={`btn btn--primary auth__submit ${loading ? "btn--loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>
          )}

          {!success && (
            <div className="auth__footer">
              <p className="auth__footer-text">
                ¿Ya tienes cuenta?{" "}
                <NavLink to="/login" className="auth__footer-link">
                  Iniciar sesión
                </NavLink>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;