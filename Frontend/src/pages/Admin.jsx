import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminAppointmentsService, changeAppointmentService } from "../services/appointment.service";
import "../styles/Admin.css";

const Admin = () => {
  const [dates, setDates] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const navigate = useNavigate();

  useEffect(() => {
    const allDate = async () => {
      try {
        const result = await getAdminAppointmentsService();
        setDates(result);
      } catch (error) { console.error(error); }
    };
    allDate();
    const interval = setInterval(allDate, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeDates = dates.filter((e) => e.state !== "cancelled" && e.state !== "pending");
  const pendingDates = dates.filter((e) => e.state === "pending");

  const handleCancel = async (appointment) => {
    if (!window.confirm("¿Cancelar esta cita?")) return;
    try {
      await changeAppointmentService(appointment._id, { slot_id: appointment.slot_id._id, state: "cancelled" });
      setDates(await getAdminAppointmentsService());
    } catch (error) { console.error(error); }
  };

  const handleConfirm = async (appointment) => {
    if (!window.confirm("¿Confirmar esta cita?")) return;
    try {
      await changeAppointmentService(appointment._id, { slot_id: appointment.slot_id._id, state: "confirmed" });
      setDates(await getAdminAppointmentsService());
    } catch (error) { console.error(error); }
  };

  const grouped = activeDates
    .filter((e) => new Date(e.slot_id.date).toISOString().split("T")[0] === selectedDate)
    .reduce((acc, cita) => {
      const emp = cita.slot_id.employee_id.name;
      if (!acc[emp]) acc[emp] = [];
      acc[emp].push(cita);
      return acc;
    }, {});

  const getStateBadge = (state) => ({
    pending:   { label: "Pendiente",  cls: "badge--pending" },
    confirmed: { label: "Confirmada", cls: "badge--confirmed" },
    cancelled: { label: "Cancelada",  cls: "badge--cancelled" },
  }[state] || { label: state, cls: "" });

  return (
    <div className="admin">
      {/* Hero */}
      <section className="admin-hero">
        <div className="container">
          <p className="text-eyebrow admin-hero__eyebrow">Panel de control</p>
          <h1 className="admin-hero__title">Panel <em>Administrador</em></h1>
          <div className="admin-hero__actions">
            <button className="btn btn--secondary" onClick={() => navigate("/admin/employees")}>Gestión Empleados</button>
            <button className="btn btn--secondary" onClick={() => navigate("/admin/slots")}>Crear Slots</button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Agenda del día */}
        <section className="admin-section">
          <div className="section-header">
            <p className="text-eyebrow">Agenda</p>
            <h2 className="admin-section__title">Citas <em>Confirmadas</em></h2>
            <div className="section-header__divider" />
          </div>

          <div className="admin-date-selector">
            <label className="form-label">Fecha</label>
            <input
              className="form-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {activeDates.length === 0 ? (
            <p className="text-muted">No hay citas confirmadas.</p>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-muted">No hay citas para esta fecha.</p>
          ) : (
            Object.entries(grouped).map(([empleado, citas]) => (
              <div key={empleado} className="admin-employee-group">
                <h3 className="admin-employee-name">{empleado}</h3>
                <div className="admin-appointments-list">
                  {citas
                    .sort((a, b) => a.slot_id.hour.localeCompare(b.slot_id.hour))
                    .map((cita) => (
                      <div key={cita._id} className="admin-appt-card">
                        <div className="admin-appt-card__header">
                          <span className="admin-appt-card__hour">{cita.slot_id.hour}</span>
                          <span className={`badge ${getStateBadge(cita.state).cls}`}>{getStateBadge(cita.state).label}</span>
                        </div>
                        <div className="admin-appt-card__body">
                          <div className="admin-appt-card__row">
                            <span className="admin-appt-card__label">Cliente</span>
                            <span className="admin-appt-card__value">{cita.client_id.name}</span>
                          </div>
                          <div className="admin-appt-card__row">
                            <span className="admin-appt-card__label">Servicio</span>
                            <span className="admin-appt-card__value">{cita.service}</span>
                          </div>
                        </div>
                        <div className="admin-appt-card__actions">
                          <button className="btn btn--danger btn--sm" onClick={() => handleCancel(cita)}>Cancelar</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pendientes */}
        <section className="admin-section">
          <div className="section-header">
            <p className="text-eyebrow">Requieren acción</p>
            <h2 className="admin-section__title">Citas <em>Pendientes</em></h2>
            <div className="section-header__divider" />
          </div>

          {pendingDates.length === 0 ? (
            <p className="text-muted">No hay citas pendientes de confirmación. ✓</p>
          ) : (
            <div className="admin-appointments-list">
              {pendingDates.map((e) => (
                <div key={e._id} className="admin-appt-card">
                  <div className="admin-appt-card__header">
                    <span className="admin-appt-card__hour">{e.slot_id.hour}</span>
                    <span className="badge badge--pending">Pendiente</span>
                  </div>
                  <div className="admin-appt-card__body">
                    <div className="admin-appt-card__row">
                      <span className="admin-appt-card__label">Fecha</span>
                      <span className="admin-appt-card__value">{new Date(e.slot_id.date).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="admin-appt-card__row">
                      <span className="admin-appt-card__label">Cliente</span>
                      <span className="admin-appt-card__value">{e.client_id.name}</span>
                    </div>
                    <div className="admin-appt-card__row">
                      <span className="admin-appt-card__label">Barbero</span>
                      <span className="admin-appt-card__value">{e.slot_id.employee_id.name}</span>
                    </div>
                    <div className="admin-appt-card__row">
                      <span className="admin-appt-card__label">Servicio</span>
                      <span className="admin-appt-card__value">{e.service}</span>
                    </div>
                    <div className="admin-appt-card__row">
                      <span className="admin-appt-card__label">Precio</span>
                      <span className="admin-appt-card__value">{e.price > 0 ? `${e.price}€` : "A consultar"}</span>
                    </div>
                  </div>
                  <div className="admin-appt-card__actions">
                    <button className="btn btn--primary btn--sm" onClick={() => handleConfirm(e)}>Aprobar</button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleCancel(e)}>Cancelar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;