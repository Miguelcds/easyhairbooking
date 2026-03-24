import { useNavigate } from "react-router-dom";
import useEmployees from "../hooks/useEmployees";
import { useEffect } from "react";
import "../styles/Employees.css";

const Employees = () => {
  const { employees, errorMsg: employeesError } = useEmployees();
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll")
    const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
        { threshold: 0.1 }
    )
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
}, [employees])

  return (
    <div className="employees">
      {/* Header */}
      <section className="employees__hero">
        <div className="container">
          <p className="text-eyebrow">Nuestro equipo</p>
          <h1 className="employees__title">
            Elige tu <em>Maestro</em>
          </h1>
          <p className="employees__subtitle">
            Cada peluquero es un artesano con años de experiencia.
            Elige el tuyo y reserva tu cita.
          </p>
          <div className="section-header__divider" />
        </div>
      </section>

      {/* Lista de empleados */}
      <section className="employees__content section">
        <div className="container">
          {employeesError && (
            <div className="alert alert--error">
              Error al cargar los empleados. Inténtalo de nuevo más tarde.
            </div>
          )}

          {employees.length > 0 ? (
            <div className="employees__grid">
              {employees.map((emplo, i) => (
                <article
                  key={emplo._id}
                  className="employees__card animate-on-scroll"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  {/* Avatar placeholder con iniciales */}
                  <div className="employees__avatar">
                    <span className="employees__avatar-initials">
                      {emplo.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="employees__card-body">
                    <h3 className="employees__name">{emplo.name}</h3>

                    <div className="employees__specialties">
                      {emplo.specialty.map((esp, i) => (
                        <span key={i} className="badge badge--gold">
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn--secondary employees__cta"
                    onClick={() =>
                      navigate(`/slots/${emplo._id}`, {
                        state: { name: emplo.name },
                      })
                    }
                  >
                    Ver disponibilidad
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard__empty">
              <h3 className="dashboard__empty-title">Sin barberos disponibles</h3>
              <p className="dashboard__empty-text">
                Actualmente no hay barberos activos. Vuelve pronto.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Employees;