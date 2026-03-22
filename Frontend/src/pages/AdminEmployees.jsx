import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import {
  toggleEmployeeService,
  editEmployeeService,
  createEmployeeService,
  getEmployeesService,
} from "../services/employee.service";


const AdminEmployees = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const [success, setSuccess] = useState("");

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const result = await getEmployeesService();
        setEmployees(result);
      } catch (error) {
        console.error(error);
      }
    };
    getEmployees();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      specialty: [],
      active: true,
    },
  });

  const createSubmit = async (data) => {
    try {
      await createEmployeeService({
        name: data.name,
        specialty: data.specialty.split(",").map((s) => s.trim()),
        active: true,
      });
      setSuccess("create");
      reset();
      const result = await getEmployeesService();
      setEmployees(result);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  // Edicion Empleado, FAlta implementar

  const editSubmit = async (data) => {
    try {
      await editEmployeeService({
        id: data._id,
        name: data.name,
        spcialty: data.specialty,
        active: true,
      });
      setErrorMsg(null);
      setSuccess("edit");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  const toggleEmployee = async (id) => {
    try {
      await toggleEmployeeService(id);
      setErrorMsg(null);
      setSuccess("change");
      const result = await getEmployeesService();
      setEmployees(result);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.error || "Algo ha salido mal 💔");
    }
  };

  return (
    <>
      <div>
        <h2>Panel Gestion Empleados</h2>
        {success === "create" && (
          <p style={{ color: "lightgreen" }}>Usuario Creado Con Exito</p>
        )}
        {success === "change" && (
          <p style={{ color: "lightgreen" }}>
            Estado Empleado Cambiado Con Exito
          </p>
        )}
        {success === "edit" && (
          <p style={{ color: "lightgreen" }}>Empleado Editado Con Exito</p>
        )}
        {errorMsg && <p style={{ color: "red" }}> {errorMsg}</p>}
      </div>
      <section>
        {employees.length > 0 ? (
          <div>
            <h3>Estado Empleados</h3>
            <ul>
              {employees.map((e) => (
                <li key={e._id}>
                  <p>Nombre: {e.name}</p>
                  <p>Estado: {e.active ? <p>En Activo</p> : <p>De Baja</p>}</p>
                  <button onClick={() => toggleEmployee(e._id)}>
                    Cambiar Estado
                  </button>
                  <button onClick={() => {
                    
                  }}>Editar </button>
                </li>
              ))}
            </ul>
            {errorMsg && <p style={{ color: "red" }}> {errorMsg}</p>}
          </div>
        ) : (
          <p> No Tienes Empleado</p>
        )}
      </section>

      <section>
        <h3>Creacion De Nuevos Empleados</h3>
        <form onSubmit={handleSubmit(createSubmit)}>
          {/* Campo Nombre */}
          <label htmlFor="name">
            Nombre Usuario:
            <input
              placeholder="Alex Garcia..."
              type="text"
              id="name"
              {...register("name", {
                required: "El nombre es Obligatorio",
                minLength: {
                  value: 2,
                  message: "Debe tener al menos 2 caracteres",
                },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "No puede contener Numeros",
                },
                validate: (value) =>
                  value.trim().length >= 2 || "No pueden ser solo espacios",
              })}
            />
            {errors.name && (
              <p style={{ color: "red" }}> {errors.name.message}</p>
            )}
          </label>

          {/* Especialidad */}

          <label htmlFor="specialty">
            Especialidad:
            <input
              type="text"
              id="specialty"
              placeholder="Separa las especialidades con comas! "
              {...register("specialty", {
                required: "No has introducido ninguna especialidad",
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/,
                  message: "No puede contener Numeros",
                },
                validate: (value) =>
                  value.trim().length >= 2 || "No pueden ser solo espacios",
              })}
            />
            {errors.specialty && (
              <p style={{ color: "red" }}> {errors.specialty.message}</p>
            )}
          </label>
          <button type="submit">Crear Nuevo Empleado</button>
        </form>
      </section>
    </>
  );
};

export default AdminEmployees;
















/*




<section>
        <h3>Editar Empleado</h3>
        {employees.length > 0 ? (
          <ul>
            {employees.map((e) => (
              <li>
                <form onSubmit={handleSubmit(editSubmit)}>
                 
                  <label htmlFor="name">
                    Nombre Usuario: 
                    <p>{e.name} </p>
                    <p>Nuevo Nombre:</p>
                    <input
                      placeholder="Alex Garcia..."
                      type="text"
                      id="name"
                      {...register("name", {
                        required: "El nombre es Obligatorio",
                        minLength: {
                          value: 2,
                          message: "Debe tener al menos 2 caracteres",
                        },
                        pattern: {
                          value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                          message: "No puede contener Numeros",
                        },
                        validate: (value) =>
                          value.trim().length >= 2 ||
                          "No pueden ser solo espacios",
                      })}
                    />
                    <br />
                    {errors.name && (
                      <p style={{ color: "red" }}> {errors.name.message}</p>
                    )}
                  </label>

                 

                  <label htmlFor="specialty">
                    Especialidad Actual:
                    {e.specialty.map((sp) => (<p>{sp}</p>))}
                    Nuevas Especialidades:
                    <input
                      type="text"
                      id="specialty"
                      placeholder="Separa las especialidades con comas! "
                      {...register("specialty", {
                        required: "No has introducido ninguna especialidad",
                        pattern: {
                          value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,]+$/,
                          message: "No puede contener Numeros",
                        },
                        validate: (value) =>
                          value.trim().length >= 2 ||
                          "No pueden ser solo espacios",
                      })}
                    />
                    {errors.specialty && (
                      <p style={{ color: "red" }}>
                        {" "}
                        {errors.specialty.message}
                      </p>
                    )}
                  </label>
                  <button type="submit">Editar Empleado</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </section>







*/