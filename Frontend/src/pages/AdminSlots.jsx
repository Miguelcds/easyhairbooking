import { useEffect, useState } from "react";
import { getEmployeesService } from "../services/employee.service";
import { useForm, useFieldArray } from "react-hook-form";
import { autoCreateSlotsService } from "../services/slot.service";

const AdminSlots = () => {
  const [employees, setEmployees] = useState([]);

  const [errorMsg, setErrorMsg] = useState(null);

  const [success, setSuccess] = useState(false);

  

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const result = await getEmployeesService();
        setEmployees(result);
        setErrorMsg(null);
      } catch (error) {
        console.error(error);
        setErrorMsg(error);
      }
    };
    getEmployees();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      employeeId: "",
      date: "",
      interval: 0,
      shifts: [
        { start: "09:00", end: "13:00" },
        { start: "16:00", end: "19:00" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shifts",
  });

  const submit = async (data) => {
    try {
      await autoCreateSlotsService({
        employee_id: data.employeeId,
        date: data.date,
        intervalMinutes: data.interval,
        shifts: data.shifts,
      });
      setErrorMsg(null)
      setSuccess(true);
    } catch (error) {
      setSuccess(false)
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  return (
    <>
      <div>
        <h3>Creacion Slots Citas </h3>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {success && (
          <div>
            <h2>Citas Añadidas Correctamente ✅</h2>
          </div>
        )}
        {/* Formulario  */}
        <form onSubmit={handleSubmit(submit)}>
          {/* Seleccion de empleado */}
          <label htmlFor="employeeId">
            Selecciona al empleado al que desea añadir citas:
            <select
              id="employeeId"
              {...register("employeeId", {
                required: "Debes Selecionar a un empleado",
                validate: (value) =>
                  value !== "" || "Debes seleccionar un empleado",
              })}
            >
              <option value="">-- Selecciona --</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p style={{ color: "red" }}> {errors.employeeId.message}</p>
            )}
          </label>
          <br />

          {/* Seleccion de Fecha  */}
          <label htmlFor="date">
            Seleciona la Fecha:
            <input
              type="date"
              id="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("date", {
                required: "Debes Indicar la fecha",
              })}
            />
            {errors.date && (
              <p style={{ color: "red" }}> {errors.date.message}</p>
            )}
          </label>
          <br />

          {/* Seleccion de Invervalo de citas, en minutoos */}
          <label htmlFor="interval">
            Seleciona cada cuanto quieres las citas en minutos:
            <input
              type="number"
              id="interval"
              min={10}
              max={120}
              {...register("interval", {
                required: "Debes Indicar un Intervalo entre citas",
              })}
            />
            {errors.interval && (
              <p style={{ color: "red" }}> {errors.interval.message}</p>
            )}
          </label>
          <br />

          <label htmlFor="shifts">
            {fields.map((field, i) => (
              <div key={field.id}>
                <input
                  type="time"
                  min={"08:00"}
                  {...register(`shifts.${i}.start`, {
                    required: "Tienes indicar la hora inicial del intervalo",
                    validate: (value) =>
                      value >= "08:00" || "No puede ser antes de las 08:00",
                  })}
                />
                {errors.shifts?.[i]?.start && (
                  <p style={{ color: "red" }}>
                    {errors.shifts[i].start.message}
                  </p>
                )}

                <input
                  type="time"
                  {...register(`shifts.${i}.end`, {
                    required: "Tienes que indicar la hora final del intervalo",
                    validate: (value) => {
                      if (value > "22:00")
                        return "No puede ser después de las 22:00";

                      const start = getValues(`shifts.${i}.start`);
                      if (value <= start)
                        return "La hora final debe ser posterior a la inicial";
                      // Convertir a minutos y comparar con el intervalo
                      const [startH, startM] = start.split(":").map(Number);
                      const [endH, endM] = value.split(":").map(Number);
                      const diff = endH * 60 + endM - (startH * 60 + startM);
                      const interval = getValues("interval");

                      return (
                        diff >= Number(interval) ||
                        `La diferencia debe ser al menos ${interval} minutos`
                      );
                    },
                  })}
                />
                {errors.shifts?.[i]?.end && (
                  <p style={{ color: "red" }}>{errors.shifts[i].end.message}</p>
                )}

                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)}>
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ start: "", end: "" })}
            >
              + Añadir Franja
            </button>
          </label>

          <button type="submit">Crear Slots Citas</button>
        </form>
      </div>
    </>
  );
};

export default AdminSlots;
