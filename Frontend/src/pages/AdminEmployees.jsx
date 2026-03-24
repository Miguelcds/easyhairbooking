import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  toggleEmployeeService,
  editEmployeeService,
  createEmployeeService,
} from "../services/employee.service";
import useEmployees from "../hooks/useEmployees";
import "../styles/Admin.css";

const AdminEmployees = () => {
  const {
    employees,
    refreshEmployees,
    errorMsg: employeesError,
  } = useEmployees(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const navigate = useNavigate();

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
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal");
    }
  };

  const editSubmit = async (data) => {
    if (!window.confirm("¿Confirmas los cambios?")) return;
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
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal");
    }
  };

  const toggleEmployee = async (id) => {
    if (!window.confirm("¿Cambiar estado del empleado?")) return;
    try {
      await toggleEmployeeService(id);
      setErrorMsg(null);
      setSuccess("change");
      refreshEmployees();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal");
    }
  };

  return (
    <div className="admin">
      <section className="admin-hero">
        <div className="container">
          <p className="text-eyebrow admin-hero__eyebrow">Panel de control</p>
          <h1 className="admin-hero__title">
            Gestión de <em>Empleados</em>
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
        {/* Feedback */}
        {success === "create" && (
          <div
            className="alert alert--success"
            style={{ marginTop: "var(--space-8)" }}
          >
            Empleado creado con éxito ✓
          </div>
        )}
        {success === "change" && (
          <div
            className="alert alert--success"
            style={{ marginTop: "var(--space-8)" }}
          >
            Estado actualizado ✓
          </div>
        )}
        {success === "edit" && (
          <div
            className="alert alert--success"
            style={{ marginTop: "var(--space-8)" }}
          >
            Empleado editado ✓
          </div>
        )}
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

        {/* Lista empleados */}
        <section className="admin-section">
          <div className="section-header">
            <p className="text-eyebrow">Equipo</p>
            <h2 className="admin-section__title">
              Empleados <em>Actuales</em>
            </h2>
            <div className="section-header__divider" />
          </div>

          <div className="admin-employees-list">
            {employees.map((e) => (
              <div key={e._id} className="admin-employee-item">
                <div className="admin-employee-item__info">
                  <span className="admin-employee-item__name">{e.name}</span>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      flexWrap: "wrap",
                      marginTop: "var(--space-2)",
                    }}
                  >
                    {e.specialty.map((sp, i) => (
                      <span key={i} className="badge badge--gold">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="admin-employee-item__actions">
                  <span
                    className={`badge ${e.active ? "badge--confirmed" : "badge--cancelled"}`}
                  >
                    {e.active ? "Activo" : "Baja"}
                  </span>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => toggleEmployee(e._id)}
                  >
                    {e.active ? "Dar de baja" : "Activar"}
                  </button>
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() =>
                      setEditingEmployee({
                        id: e._id,
                        name: e.name,
                        specialty: e.specialty,
                      })
                    }
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Edición */}
        {editingEmployee && (
          <section className="admin-section">
            <div className="admin-edit-form">
              <p className="admin-edit-form__title">
                Editando: {editingEmployee.name}
              </p>
              <form onSubmit={handleEdit(editSubmit)}>
                <div className="form-group">
                  <label className="form-label">
                    Nuevo nombre{" "}
                    <span className="admin-edit-form__current">
                      (actual: {editingEmployee.name})
                    </span>
                  </label>
                  <input
                    className={`form-input ${errorsEdit.name ? "form-input--error" : ""}`}
                    type="text"
                    placeholder={editingEmployee.name}
                    {...registerEdit("name", {
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                      pattern: {
                        value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                        message: "Solo letras",
                      },
                    })}
                  />
                  {errorsEdit.name && (
                    <p className="form-error">{errorsEdit.name.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Especialidades{" "}
                    <span className="admin-edit-form__current">
                      (actuales: {editingEmployee.specialty.join(", ")})
                    </span>
                  </label>
                  <input
                    className={`form-input ${errorsEdit.specialty ? "form-input--error" : ""}`}
                    type="text"
                    placeholder="Separa con comas"
                    {...registerEdit("specialty", {
                      pattern: {
                        value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/,
                        message: "Solo letras y comas",
                      },
                    })}
                  />
                  {errorsEdit.specialty && (
                    <p className="form-error">{errorsEdit.specialty.message}</p>
                  )}
                </div>
                <div className="admin-edit-form__actions">
                  <button type="submit" className="btn btn--primary">
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setEditingEmployee(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Crear empleado */}
        <section className="admin-section">
          <div className="section-header">
            <p className="text-eyebrow">Nuevo</p>
            <h2 className="admin-section__title">
              Añadir <em>Empleado</em>
            </h2>
            <div className="section-header__divider" />
          </div>
          <div style={{ maxWidth: "480px" }}>
            <form onSubmit={handleCreate(createSubmit)}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  className={`form-input ${errorsCreate.name ? "form-input--error" : ""}`}
                  type="text"
                  placeholder="Alex García"
                  {...registerCreate("name", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                      message: "Solo letras",
                    },
                    validate: (v) =>
                      v.trim().length >= 2 || "No pueden ser solo espacios",
                  })}
                />
                {errorsCreate.name && (
                  <p className="form-error">{errorsCreate.name.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Especialidades</label>
                <input
                  className={`form-input ${errorsCreate.specialty ? "form-input--error" : ""}`}
                  type="text"
                  placeholder="Corte, Barba, Mechas..."
                  {...registerCreate("specialty", {
                    required: "Introduce al menos una especialidad",
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/,
                      message: "Solo letras y comas",
                    },
                    validate: (v) =>
                      v.trim().length >= 2 || "No pueden ser solo espacios",
                  })}
                />
                {errorsCreate.specialty && (
                  <p className="form-error">{errorsCreate.specialty.message}</p>
                )}
              </div>
              <button type="submit" className="btn btn--primary">
                Crear Empleado
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminEmployees;
