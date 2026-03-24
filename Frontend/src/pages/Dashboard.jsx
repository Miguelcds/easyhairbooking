import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {getMyAppointmentsService,changeAppointmentService} from "../services/appointment.service";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const myDates = async () => {
      try {
        const result = await getMyAppointmentsService();
        setDates(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    myDates();
  }, []);

  const handleCancel = async (appointment) => {
    const confirm = window.confirm("¿Estás seguro de que quieres cancelar esta cita?");
    if (!confirm) return;
    try {
      await changeAppointmentService(appointment._id, {
        slot_id: appointment.slot_id._id,
        state: "cancelled",
      });
      const result = await getMyAppointmentsService();
      setDates(result);
    } catch (error) {
      console.error(error);
    }
  };

  const activeDates = dates.filter((e) => e.state !== "cancelled");

  const getStateBadge = (state) => {
    const map = {
      pending:   { label: "Pendiente",  cls: "badge--pending" },
      confirmed: { label: "Confirmada", cls: "badge--confirmed" },
      cancelled: { label: "Cancelada",  cls: "badge--cancelled" },
    };
    return map[state] || { label: state, cls: "" };
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <section className="dashboard__hero">
        <div className="container">
          <p className="text-eyebrow">Panel de cliente</p>
          <h1 className="dashboard__title">
            Bienvenido, <em>{user.name}</em>
          </h1>
          <div className="dashboard__actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate("/employees")}
            >
              Nueva Reserva
            </button>
            {isAdmin && (
              <button
                className="btn btn--secondary"
                onClick={() => navigate("/admin")}
              >
                Panel Admin
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Citas */}
      <section className="dashboard__content section">
        <div className="container">
          <div className="section-header">
            <p className="text-eyebrow section-header__eyebrow">Tu agenda</p>
            <h2 className="dashboard__section-title">Tus Citas</h2>
            <div className="section-header__divider" />
          </div>

          {loading ? (
            <div className="dashboard__loading">
              <div className="dashboard__spinner" />
              <p>Cargando tus citas...</p>
            </div>
          ) : activeDates.length > 0 ? (
            <div className="dashboard__grid">
              {activeDates.map((e) => {
                const badge = getStateBadge(e.state);
                return (
                  <article key={e._id} className="dashboard__card">
                    <div className="dashboard__card-header">
                      <div className="dashboard__card-date">
                        <span className="dashboard__card-day">
                          {new Date(e.slot_id.date).toLocaleDateString("es-ES", { day: "2-digit" })}
                        </span>
                        <span className="dashboard__card-month">
                          {new Date(e.slot_id.date).toLocaleDateString("es-ES", { month: "short" })}
                        </span>
                      </div>
                      <span className={`badge ${badge.cls}`}>{badge.label}</span>
                    </div>

                    <div className="dashboard__card-body">
                      <div className="dashboard__card-row">
                        <span className="dashboard__card-label">Hora</span>
                        <span className="dashboard__card-value">{e.slot_id.hour}</span>
                      </div>
                      <div className="dashboard__card-row">
                        <span className="dashboard__card-label">Servicio</span>
                        <span className="dashboard__card-value">{e.service}</span>
                      </div>
                      <div className="dashboard__card-row">
                        <span className="dashboard__card-label">Precio estimado</span>
                        <span className="dashboard__card-value dashboard__card-price">
                          {e.price > 0 ? `${e.price}€` : "A consultar"}
                        </span>
                      </div>
                    </div>
                    {e.state == "confirmed" && (
                      <div className="dashboard__card-footer">
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => handleCancel(e)}
                        >
                          Cancelar cita
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="dashboard__empty">
              {/* <span className="dashboard__empty-icon"></span> */}
              <h3 className="dashboard__empty-title">Sin citas activas</h3>
              <p className="dashboard__empty-text">
                Reserva tu primera cita y disfruta de la experiencia EasyHairBook.
              </p>
              <button
                className="btn btn--primary"
                onClick={() => navigate("/employees")}
              >
                Reservar Ahora
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;