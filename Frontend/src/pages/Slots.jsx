import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSlotsService } from "../services/slot.service";

const Slots = () => {

  // Recoger de la URL el ID del trabajador
  const { employeeId } = useParams();

  //

  //const today = new Date().toISOString().split("T")[0];

  // Variable que recoge la fecha seleccionada por el usuario
  const [date, setDate] = useState(null);

  // Variable que recoge las citas/horarios disponible para el dia seleccionado
  const [slots, setSlots] = useState([]);

  // Variable que recoge posibles errores o la posibiidad de que para el dia seleccionado no hay citas disponibles
  const [error, setError] = useState();

  const navigate = useNavigate();

  const {state} = useLocation()

  useEffect(() => {
    const avaliableSlots = async () => {
      try {
        // Si no hay fecha selecionada retorna
        if (!date) return setSlots([]);

        // Vacio Errores Anteriores
        setError(null);

        //Si no hay contenido en el resulto el error se dirige al catch
        const result = await getSlotsService(employeeId, date);

        // Si Todo ok, se guarda el resultado en los Slots
        setSlots(result);
      } catch (error) {
        setError(error.response?.data.error || "No hay citas disponibles 💔");
        setSlots([]);
        console.error(error);
      }
    };
    avaliableSlots();
  }, [date]);

  return (
    <>
      <div>
        <h3>Reserva tu cita con {state.name}</h3>
        <p>Seleccione una Fecha por favor: </p>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {slots.length > 0 && (
        <ul>
          Fecha Seleccionada : {date}
          {slots.map((slot) => (
            <li>
              {slot.hour}
              <button onClick={() => navigate(`/book/${slot._id}`)}>
                Seleccionar
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error} ➡️ {date}
        </p>
      )}
    </>
  );
};

export default Slots;
