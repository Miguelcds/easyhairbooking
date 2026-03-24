import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAdminAppointmentsService,
  changeAppointmentService,
} from "../services/appointment.service";

const Admin = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [dates, setDates] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const navigate = useNavigate();

  useEffect(() => {
    const allDate = async () => {
      try {
        const result = await getAdminAppointmentsService();
        setDates(result);
        return;
      } catch (error) {
        console.error(error);
      }
    };
    allDate();
    const interval = setInterval(allDate, 30000); // cada 30 segundos se refresca la pagina
    return () => clearInterval(interval); // limpiar al desmontar
    // En futuras versiones se plantea sustituir el polling por WebSockets para notificaciones en tiempo real.
  }, []);

  const activeDates = dates.filter(
    (e) => e.state !== "cancelled" && e.state !== "pending",
  );

  const pendingDates = dates.filter((e) => e.state === "pending");

  const handleCancel = async (appointment) => {
    const confirm = window.confirm(
      "¿Estás seguro de que quieres cancelar esta cita?",
    );
    if (!confirm) return;
    try {
      await changeAppointmentService(appointment._id, {
        slot_id: appointment.slot_id._id,
        state: "cancelled",
      });

      const result = await getAdminAppointmentsService();
      setDates(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async (appointment) => {
    const confirm = window.confirm(
      "¿Estás seguro de que quieres Aprobar esta cita?",
    );
    if (!confirm) return;
    try {
      await changeAppointmentService(appointment._id, {
        slot_id: appointment.slot_id._id,
        state: "confirmed",
      });

      const result = await getAdminAppointmentsService();
      setDates(result);
    } catch (error) {
      console.error(error);
    }
  };

  /*
  Funcion Que Una vez seleccionado el dia, convierte el 
  
  */

  const grouped = activeDates
    .filter(
      (e) =>
        new Date(e.slot_id.date).toISOString().split("T")[0] === selectedDate,
    )
    .reduce((acc, cita) => {
      const empleado = cita.slot_id.employee_id.name;
      if (!acc[empleado]) acc[empleado] = [];
      acc[empleado].push(cita);
      return acc;
    }, {});

  return (
    <>
      <div>
        <h1>Panel Admin</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <section>
        <h3>Tus Proximas Citas </h3>
        <h4>Proximas Citas para el {selectedDate}: </h4>
        {activeDates.length > 0 ? (
          <div>
            <input
              value={selectedDate}
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {Object.keys(grouped).length > 0 ? (Object.entries(grouped).map(([empleado, citas]) => (
              <div key={empleado}>
                <h4>{empleado}</h4>
                <ul>
                  {citas
                    .sort((a, b) =>
                      a.slot_id.hour.localeCompare(b.slot_id.hour),
                    )
                    .map((cita) => (
                      <li key={cita._id}>
                        <p>Hora: {cita.slot_id.hour}</p>
                        <p>Cliente: {cita.client_id.name}</p>
                        <p>Servicio: {cita.service}</p>
                        <p>Estado: {cita.state}</p>
                        <button onClick={() => handleCancel(cita)}>
                          Cancelar
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))):(<p>No Tienes Citas Para esta Fecha </p>)}
          </div>
        ) : (
          <p>No Tienes Citas Por el Momento</p>
        )}
      </section>

      <section>
        <h3>Citas Pendientes Confirmacion</h3>
        {pendingDates.length > 0 ? (
          <ul>
            {pendingDates.map((e) => (
              <li key={e._id}>
                <p>
                  Fecha: {new Date(e.slot_id.date).toLocaleDateString("es-ES")}
                </p>
                <p>Hora: {e.slot_id.hour} </p>
                <p>Nombre Cliente: {e.client_id.name}</p>
                <p>Trabajador Asigando: {e.slot_id.employee_id.name}</p>
                <p>Servivio: {e.service}</p>
                <p>Precio Estimado: {e.price}</p>
                <p>Estado: {e.state}</p>
                <button onClick={() => handleCancel(e)}>Cancelar</button>
                <button onClick={() => handleConfirm(e)}>Aprobar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Tienes Pendientes de Aprobar</p>
        )}
      </section>

      <section>
        <h3>Gestiona Tus Empleado - Altas - Bajas - Ediciones </h3>
        <button onClick={() => navigate("/admin/employees")}>
          Gestion Empleados
        </button>
      </section>

      <section>
         <h3>Gestiona los Slots por empleado </h3>
        <button onClick={() => navigate("/admin/slots")}>
          Gestion de Slots
        </button>
      </section>
    </>
  );
};

export default Admin;
