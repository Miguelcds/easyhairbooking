import { useState } from "react";
import { useForm } from "react-hook-form";
import {toggleEmployeeService,editEmployeeService,createEmployeeService} from "../services/employee.service";
import useEmployees from "../hooks/useEmployees";

const AdminEmployees = () => {
  const {employees, refreshEmployees, errorMsg: employeesError} = useEmployees(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({ defaultValues: { name: "", specialty: "" } });

  const {
    register: registerEdit,
    handleSubmit: handleEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({ defaultValues: { name: "", specialty: "" } });

  const createSubmit = async (data) => {
    try {
      await createEmployeeService({
        name: data.name,
        specialty: data.specialty.split(",").map((s) => s.trim()),
        active: true,
      });
      setSuccess("create");
      setErrorMsg(null);
      resetCreate();
      refreshEmployees();
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  const editSubmit = async (data) => {
    const confirm = window.confirm("¿Estás seguro de que quieres editar a este empleado?");
    if (!confirm) return;
    try {
      await editEmployeeService(editingEmployee.id, {
        name: data.name || editingEmployee.name,
        specialty: data.specialty
          ? data.specialty.split(",").map((s) => s.trim())
          : editingEmployee.specialty,
      });
      setErrorMsg(null);
      setSuccess("edit");
      resetEdit();
      setEditingEmployee(null);
      refreshEmployees();
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  const toggleEmployee = async (id) => {
    const confirm = window.confirm("¿Estás seguro de que quieres cambiar el estado del empleado?");
    if (!confirm) return;
    try {
      await toggleEmployeeService(id);
      setErrorMsg(null);
      setSuccess("change");
      refreshEmployees();
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  return (
    <>
      <div>
        <h2>Panel Gestion Empleados</h2>
        {success === "create" && <p style={{ color: "lightgreen" }}>Usuario Creado Con Exito</p>}
        {success === "change" && <p style={{ color: "lightgreen" }}>Estado Empleado Cambiado Con Exito</p>}
        {success === "edit" && <p style={{ color: "lightgreen" }}>Empleado Editado Con Exito</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {employeesError && <p style={{ color: "red" }}>Error cargando empleados</p>}
      </div>

      <section>
        {employees.length > 0 ? (
          <div>
            <h3>Estado Empleados</h3>
            <ul>
              {employees.map((e) => (
                <li key={e._id}>
                  <p>Nombre: {e.name}</p>
                  <p>Estado: {e.active ? <span>En Activo</span> : <span>De Baja</span>}</p>
                  <button onClick={() => toggleEmployee(e._id)}>Cambiar Estado</button>
                  <button onClick={() => setEditingEmployee({ id: e._id, name: e.name, specialty: e.specialty })}>
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No Tienes Empleados</p>
        )}
      </section>

      {editingEmployee && (
        <section>
          <form onSubmit={handleEdit(editSubmit)}>
            <label htmlFor="name">
              Nombre Actual: <p>{editingEmployee.name}</p>
              Nuevo Nombre:
              <input placeholder="Alex Garcia..." type="text" id="name"
                {...registerEdit("name", {
                  minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                  pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "No puede contener números" },
                })}
              />
              {errorsEdit.name && <p style={{ color: "red" }}>{errorsEdit.name.message}</p>}
            </label>
            <br />
            <label htmlFor="specialty">
              Especialidad Actual:
              {editingEmployee.specialty.map((sp, i) => <p key={i}>{sp}</p>)}
              Nuevas Especialidades:
              <input type="text" id="specialty" placeholder="Separa con comas"
                {...registerEdit("specialty", {
                  pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/, message: "No puede contener números" },
                })}
              />
              {errorsEdit.specialty && <p style={{ color: "red" }}>{errorsEdit.specialty.message}</p>}
            </label>
            <br />
            <button type="submit">Editar Empleado</button>
            <button type="button" onClick={() => setEditingEmployee(null)}>Cancelar</button>
          </form>
        </section>
      )}

      <section>
        <h3>Creacion De Nuevos Empleados</h3>
        <form onSubmit={handleCreate(createSubmit)}>
          <label htmlFor="name">
            Nombre:
            <input placeholder="Alex Garcia..." type="text" id="name"
              {...registerCreate("name", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "No puede contener números" },
                validate: (value) => value.trim().length >= 2 || "No pueden ser solo espacios",
              })}
            />
            {errorsCreate.name && <p style={{ color: "red" }}>{errorsCreate.name.message}</p>}
          </label>
          <label htmlFor="specialty">
            Especialidad:
            <input type="text" id="specialty" placeholder="Separa con comas"
              {...registerCreate("specialty", {
                required: "Introduce al menos una especialidad",
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/, message: "No puede contener números" },
                validate: (value) => value.trim().length >= 2 || "No pueden ser solo espacios",
              })}
            />
            {errorsCreate.specialty && <p style={{ color: "red" }}>{errorsCreate.specialty.message}</p>}
          </label>
          <button type="submit">Crear Nuevo Empleado</button>
        </form>
      </section>
    </>
  );
};

export default AdminEmployees;