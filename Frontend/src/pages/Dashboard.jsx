import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getMyAppointmentsService,
  cancelAppointmentService,
} from "../services/appointment.service";

const Dashboard = () => {
  const { logout, user } = useAuth();

  const [dates, setDates] = useState([]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const avaliableDates = async () => {
      try {
        const result = await getMyAppointmentsService();

        setDates(result);

        return;
      } catch (error) {
        console.error(error);
      }
    };

    avaliableDates();
  }, []);

  const handleCancel = async (appointment) => {
    try {
      await cancelAppointmentService(appointment._id, {
        slot_id: appointment.slot_id._id,
      });

      const result = await getMyAppointmentsService();
      setDates(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dasboard</h1>
      <h2>Bienvenido, {user.name} </h2>
      <section>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate("/employees")}>
          Citas Disponibles
        </button>
      </section>
      <section>
        <h3>Citas</h3>
        {dates.length > 0 ? (
          <ul>
            {dates.filter(e => e.state !== "cancelled").map((e) => (
              <li key={e._id}>
                <p>
                  Fecha: {new Date(e.slot_id.date).toLocaleDateString("es-ES")}
                </p>
                <p>Hora: {e.slot_id.hour} </p>
                <p>Servivio: {e.service}</p>
                <p>Precio Estimado: {e.price}</p>
                <p>Estado: {e.state}</p>
                <button onClick={() => handleCancel(e)}>Cancelar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Tienes Citas Por el Momento</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
