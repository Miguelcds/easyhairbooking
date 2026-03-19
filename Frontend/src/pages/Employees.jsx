import { useEffect, useState } from "react";
import { getEmployeesService } from "../services/employee.service";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployee] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const data = async () => {
      try {
        const result = await getEmployeesService();
        setEmployee(result);
      } catch (error) {
        console.error(error);
      }
    };

    data();
  }, []);

  return (
    <>
      <ul>
        {employees.map((emplo) => (
          <li key={emplo._id}>
            <h3>{emplo.name}</h3>
            {emplo.specialty.map((esp, i) => (
              <span key={i}>Especialidades: {esp} </span>
            ))}                                                     {/*Envia el  */}
            <button onClick={() => navigate(`/slots/${emplo._id}`, {state: {name: emplo.name}})}>Ver disponibilidad</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Employees;
