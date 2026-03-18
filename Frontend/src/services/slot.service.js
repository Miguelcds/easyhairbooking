import axiosClient from "./axios.config";

export const getSlotsService = async (employeeId, date) => {
  try {
    if (employeeId === null || date === null) {
      throw new Error("No hay Datos que consultar a la BBDD ⚠️");
    }

    const result = await axiosClient.get(`/slot?employee=${employeeId}&date=${date}`)

    return result.data


  } catch (error) {
    console.error(error);
    throw error
  }
};


