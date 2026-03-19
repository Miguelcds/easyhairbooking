import { useNavigate, useParams } from "react-router-dom";
import { bookAppointmentService } from "../services/appointment.service";
import { useState } from "react";

const Book = () => {
  // Leo el Id que viene por parametros
  const { slotId } = useParams();

  // Variables De Error y confirmacion
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const [service, setService] = useState([]);

  // Navegacion Entre Paginas, un componente de React
  const navigate = useNavigate();

  // El Precio No Sera fijo, Se calculará en Base a lo que marque el usuario

  const calculatePrice = (services) => {
    let precio = 0;
    if (services.includes("cortar")) precio += 15;
    if (services.includes("mechas")) precio += 30;
    if (services.includes("peinar")) precio += 7;
    if (services.includes("especial")) precio += 40;
    if (services.includes("barba")) precio += 10;
    if (services.includes("otro")) return 0;
    return precio;
  };

  const price = calculatePrice(service);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await bookAppointmentService({
        slot_id: slotId,
        service: service.join(", "),
        price: price,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.error ||
          "Algo salio Mal, intentelo de nuevo mas tarde o contacte directamente con el centro mediante el siguiente Numero: 944678534",
      );
    }
  };

  return (
    <>
      <div>Confirmacion De Cita</div>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {success ? (
        <div>
          <h2>
            ✅ Cita Registrada Correctamente, en un plazo de x se realizara la
            confirmacion
          </h2>
          <p>Ha elegido:</p>
          {service.length && service.map((e) => <p>{e}</p>)}
          <p>El Precio Aproximado:</p>
          {price > 0 ? (
            <p>{price}</p>
          ) : (
            <p>
              En base a los servicios elegidos no es posible hacer una
              estimación
            </p>
          )}
          <button onClick={() => navigate("/dashboard")}>
            Volver al Dashboard
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={submit}>
            Que Servicios Desea:
            {["cortar", "mechas", "peinar", "especial", "barba", "otro"].map(
              (s) => (
                <label key={s}>
                    
                  <input
                    type="checkbox"
                    value={s}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setService([...service, s]);
                      } else {
                        setService(service.filter((item) => item !== s));
                      }
                    }}
                  />
                  {s}
                </label>
              ),
            )}
            <button type="submit">Confirmar</button>
            <button onClick={() => navigate("/dashboard")}>Cancelar</button>
          </form>
          <section>
            <ul> 
              <li>✂️ Cortar — 15€</li>
              <li>🎨 Mechas — 30€</li>
              <li>💇 Solo Peinar — 7€</li>
              <li>⭐ Sesión Especial — 40€</li>
              <li>🪒 Barba — 10€</li>
              <li>❓ Otro — Precio a consultar</li>
            </ul> Tenga en cuenta que los precion pueden Variar, tan solo es una estimacion
          </section>
        </div>
      )}
    </>
  );
};

export default Book;
