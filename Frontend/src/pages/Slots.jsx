import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSlotsService } from "../services/slot.service";
import "../styles/Slots.css";

const Slots = () => {
  // Recoger de la URL el ID del trabajador 
  const { employeeId } = useParams();

  // Variable que recoge la fecha seleccionada por el usuario
  const [date, setDate] = useState(null);

  // Variable que recoge las citas/horarios disponible para el dia seleccionado
  const [slots, setSlots] = useState([]);

   // Variable que recoge posibles errores o la posibiidad de que para el dia seleccionado no hay citas disponibles
  const [error, setError] = useState();

  // Navegacion Entre Paginas
  const navigate = useNavigate();


  const { state } = useLocation();


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
        setError(error.response?.data.error || "No hay citas disponibles para esta fecha");
        setSlots([]);
      }
    };
    avaliableSlots();
  }, [date]);

  return (
    <div className="slots">
      {/* Header */}
      <section className="slots__hero">
        <div className="container">
          <p className="text-eyebrow">Paso 2 de 3</p>
          <h1 className="slots__title">
            Cita con <em>{state?.name}</em>
          </h1>
          <p className="slots__subtitle">
            Selecciona el día y elige el horario que mejor te venga.
          </p>
          <div className="section-header__divider" />
        </div>
      </section>

      {/* Selector de fecha + slots */}
      <section className="slots__content section">
        <div className="container">
          <div className="slots__date-wrapper">
            <label className="form-label">Selecciona la fecha</label>
            <input
              className="form-input slots__date-input"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert--error slots__alert">
              {error}{date ? ` — ${new Date(date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}` : ""}
            </div>
          )}

          {slots.length > 0 && (
            <div className="slots__results">
              <p className="slots__results-label text-eyebrow">
                {slots.length} horarios disponibles —{" "}
                {new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric"
                })}
              </p>
              <div className="slots__grid">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    className="slots__slot"
                    onClick={() => navigate(`/book/${slot._id}`)}
                  >
                    <span className="slots__slot-hour">{slot.hour}</span>
                    <span className="slots__slot-label">Disponible</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!date && (
            <div className="slots__empty">
              <p className="slots__empty-text">Elige una fecha para ver los horarios disponibles</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Slots;