import { useNavigate } from "react-router-dom";

import useEmployees from "../hooks/useEmployees";

const Employees = () => {
  const { employees, errorMsg: employeesError } = useEmployees();
  const navigate = useNavigate();

  return (
    <>
    {employeesError && (<p>Error al cargar los empleados, intentelo de Nuevo mas tarde</p>)}
      {employees.length > 0 ? (
        <ul>
          {employees.map((emplo) => (
            <li key={emplo._id}>
              <h3>{emplo.name}</h3>
              {emplo.specialty.map((esp, i) => (
                <span key={i}>Especialidades: {esp} </span>
              ))}
              {/*Envia el  */}
              <button
                onClick={() =>
                  navigate(`/slots/${emplo._id}`, {
                    state: { name: emplo.name },
                  })
                }
              >
                Ver disponibilidad
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Actualmente No hay Empleados Disponibles</p>
      )}
    </>
  );
};

export default Employees;
