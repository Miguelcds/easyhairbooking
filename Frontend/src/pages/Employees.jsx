import { useEffect, useState } from "react";
import { getEmployeesService } from "../services/employee.service";

const Employees = () => {
  const [employees, setEmployee] = useState([]);

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
            ))}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Employees;
