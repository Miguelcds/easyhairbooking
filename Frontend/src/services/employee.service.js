import axiosClient from "./axios.config";

/* 
Recuerda! La Respuesta de Axios es:
result = {
  data: [...], ← la respuesta real del servidor
  status: 200,
  headers: {...},
  config: {...}
}
Por eso cogemos result.data 
*/

export const getEmployeesService = async () => {
  try {
    const result = await axiosClient.get("/employee");
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const toggleEmployeeService = async (idEmployee) => {
  try {
    const result = await axiosClient.patch(`/employee/${idEmployee}`);

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editEmployeeService = async (idEmployee, data) => {
  try {
    const result = await axiosClient.put(`/employee/${idEmployee}`, data);

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const createEmployeeService = async (dataEmployee) => {
  try {
    const result = await axiosClient.post(`/employee/`, dataEmployee);

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};