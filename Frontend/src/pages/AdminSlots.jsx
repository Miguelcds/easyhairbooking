import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { autoCreateSlotsService } from "../services/slot.service";
import useEmployees from "../hooks/useEmployees";
import "../styles/Admin.css";

const AdminSlots = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const { employees, errorMsg: employeesError } = useEmployees();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      employeeId: "",
      date: "",
      interval: 45,
      shifts: [
        { start: "09:00", end: "13:00" },
        { start: "16:00", end: "20:00" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "shifts" });

  const submit = async (data) => {
    try {
      await autoCreateSlotsService({
        employee_id: data.employeeId,
        date: data.date,
        intervalMinutes: data.interval,
        shifts: data.shifts,
      });
      setErrorMsg(null);
      setSuccess(true);
      reset();
    } catch (error) {
      setSuccess(false);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal");
    }
  };

  return (
    <div className="admin">
      <section className="admin-hero">
        <div className="container">
          <p className="text-eyebrow admin-hero__eyebrow">Panel de control</p>
          <h1 className="admin-hero__title">
            Crear <em>Slots</em>
          </h1>
          <div className="admin-hero__actions">
            <button
              className="btn btn--ghost"
              onClick={() => navigate("/admin")}
            >
              ← Volver al Panel
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        {errorMsg && (
          <div
            className="alert alert--error"
            style={{ marginTop: "var(--space-8)" }}
          >
            {errorMsg}
          </div>
        )}
        {employeesError && (
          <div
            className="alert alert--error"
            style={{ marginTop: "var(--space-8)" }}
          >
            Error cargando empleados
          </div>
        )}
        {success && (
          <div
            className="alert alert--success"
            style={{ marginTop: "var(--space-8)" }}
          >
            ✓ Slots creados correctamente
          </div>
        )}

        <section className="admin-section">
          <div className="section-header">
            <p className="text-eyebrow">Configuración</p>
            <h2 className="admin-section__title">
              Generar <em>Horarios</em>
            </h2>
            <div className="section-header__divider" />
          </div>

          <form className="admin-slots-form" onSubmit={handleSubmit(submit)}>
            {/* Empleado */}
            <div className="form-group">
              <label className="form-label">Empleado</label>
              <select
                className={`form-select ${errors.employeeId ? "form-input--error" : ""}`}
                id="employeeId"
                {...register("employeeId", {
                  required: "Selecciona un empleado",
                  validate: (v) => v !== "" || "Selecciona un empleado",
                })}
              >
                <option value="">— Selecciona —</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="form-error">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                className={`form-input ${errors.date ? "form-input--error" : ""}`}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("date", { required: "Indica la fecha" })}
              />
              {errors.date && (
                <p className="form-error">{errors.date.message}</p>
              )}
            </div>

            {/* Intervalo */}
            <div className="form-group">
              <label className="form-label">
                Intervalo entre citas (minutos)
              </label>
              <input
                className={`form-input ${errors.interval ? "form-input--error" : ""}`}
                type="number"
                min={10}
                max={120}
                style={{ maxWidth: "160px" }}
                {...register("interval", { required: "Indica el intervalo" })}
              />
              {errors.interval && (
                <p className="form-error">{errors.interval.message}</p>
              )}
            </div>

            {/* Franjas */}
            <div className="form-group">
              <label className="form-label">Franjas horarias</label>
              <div className="admin-shifts-list">
                {fields.map((field, i) => (
                  <div key={field.id} className="admin-shift-row">
                    <input
                      className="form-input"
                      type="time"
                      {...register(`shifts.${i}.start`, {
                        required: "Indica la hora inicial",
                        validate: (v) =>
                          v >= "08:00" || "No antes de las 08:00",
                      })}
                    />
                    <span className="admin-shift-separator">hasta</span>
                    <input
                      className="form-input"
                      type="time"
                      {...register(`shifts.${i}.end`, {
                        required: "Indica la hora final",
                        validate: (value) => {
                          if (value > "22:00") return "No después de las 22:00";
                          const start = getValues(`shifts.${i}.start`);
                          if (value <= start)
                            return "Debe ser posterior al inicio";
                          const [sh, sm] = start.split(":").map(Number);
                          const [eh, em] = value.split(":").map(Number);
                          const diff = eh * 60 + em - (sh * 60 + sm);
                          const interval = getValues("interval");
                          return (
                            diff >= Number(interval) ||
                            `Diferencia mínima: ${interval} min`
                          );
                        },
                      })}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => remove(i)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {errors.shifts && (
                  <p className="form-error">
                    {
                      errors.shifts
                        ?.map?.((s) => s?.start?.message || s?.end?.message)
                        .filter(Boolean)[0]
                    }
                  </p>
                )}
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                style={{ marginTop: "var(--space-3)" }}
                onClick={() => append({ start: "", end: "" })}
              >
                + Añadir Franja
              </button>
            </div>

            <button type="submit" className="btn btn--primary btn--lg">
              Generar Slots
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminSlots;
