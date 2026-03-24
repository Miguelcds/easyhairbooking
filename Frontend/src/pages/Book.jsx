import { useNavigate, useParams } from "react-router-dom";
import { bookAppointmentService } from "../services/appointment.service";
import { useState } from "react";
import "../styles/Book.css";
import {SERVICES} from "../data/servicesData"
import {calculatePrice} from "../utils/calculatePrices"


const Book = () => {
  const { slotId } = useParams();
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const [service, setService] = useState([]);
  const navigate = useNavigate();

  const price = calculatePrice(service);

  const toggleService = (val) => {
    setService((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (service.length === 0) {
      setErrorMsg("Selecciona al menos un servicio");
      return;
    }
    const confirmed = window.confirm("¿Confirmas tu solicitud de cita?");
    if (!confirmed) return;
    try {
      await bookAppointmentService({
        slot_id: slotId,
        service: service.join(", "),
        price,
      });
      setErrorMsg(null)
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Algo salió mal. Llámanos al 944 678 534.");
    }
  };

  return (
    <div className="book">
      <section className="book__hero">
        <div className="container">
          <p className="text-eyebrow">Paso 3 de 3</p>
          <h1 className="book__title">Confirmar <em>Reserva</em></h1>
          <div className="section-header__divider" />
        </div>
      </section>

      <section className="book__content section">
        <div className="container">
          {errorMsg && <div className="alert alert--error book__alert">{errorMsg}</div>}

          {success ? (
            <div className="book__success">
              <h2 className="book__success-title">¡Cita Solicitada!</h2>
              <p className="book__success-text">
                Tu cita ha sido registrada. En breve prodrás visulizar la confirmacion en el Dasboard.
              </p>
              <div className="book__success-summary">
                <p className="text-eyebrow">Has elegido</p>
                <div className="book__success-services">
                  {service.map((s) => {
                    const svc = SERVICES.find((sv) => sv.value === s);
                    return (
                      <span key={s} className="badge badge--gold">
                        {svc?.icon} {svc?.label}
                      </span>
                    );
                  })}
                </div>
                <p className="book__success-price">
                  {price > 0 ? `Estimado: ${price}€` : "Precio a consultar"}
                </p>
              </div>
              <button className="btn btn--primary" onClick={() => navigate("/dashboard")}>
                Ver mis citas
              </button>
            </div>
          ) : (
            <div className="book__layout">
              {/* Formulario */}
              <div className="book__form-section">
                <h2 className="book__section-heading">Servicios - Puedes elegir varios:</h2>
                <form onSubmit={submit}>
                  <div className="book__services">
                    {SERVICES.map((svc) => (
                      <label
                        key={svc.value}
                        className={`book__service-option ${service.includes(svc.value) ? "book__service-option--selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          value={svc.value}
                          checked={service.includes(svc.value)}
                          onChange={() => toggleService(svc.value)}
                          className="book__checkbox"
                        />
                        <span className="book__service-label">{svc.label}</span>
                        <span className="book__service-price">{svc.price}</span>
                      </label>
                    ))}
                  </div>

                  <div className="book__form-actions">
                    <button type="submit" className="btn btn--primary btn--lg">
                      Confirmar Cita
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => {
                        if (window.confirm("¿Salir sin reservar?")) navigate("/employees");
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

              {/* Resumen precio */}
              <aside className="book__summary">
                <p className="text-eyebrow">Resumen</p>
                <div className="book__summary-card">
                  {service.length === 0 ? (
                    <p className="book__summary-empty">Selecciona servicios para ver el precio estimado</p>
                  ) : (
                    <>
                      {service.map((s) => {
                        const svc = SERVICES.find((sv) => sv.value === s);
                        return (
                          <div key={s} className="book__summary-row">
                            <span>{svc?.label}</span>
                            <span>{svc?.price}</span>
                          </div>
                        );
                      })}
                      <div className="book__summary-divider" />
                      <div className="book__summary-total">
                        <span>Total estimado</span>
                        <span className="book__summary-price">
                          {price > 0 ? `${price}€` : "consultar"}
                        </span>
                      </div>
                      <p className="book__summary-note">
                        * Los precios son orientativos y pueden variar.
                      </p>
                    </>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Book;