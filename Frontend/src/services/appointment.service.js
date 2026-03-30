import axiosClient from "./axios.config";

export const bookAppointmentService = async (appointmentData) => {
  try {
    const result = await axiosClient.post("/appointment", appointmentData);
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMyAppointmentsService = async () => {
  try {
    const result = await axiosClient.get("/appointment/my");

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Sirve Para Cancelar citas en el User y Aprobar - cancelar citas al Admin

export const changeAppointmentService = async (id, appointmentData) => {
  try {
    const result = await axiosClient.patch(`/appointment/${id}`, appointmentData)

    return result.data
    
  } catch (error) {
    console.error(error);
    throw error
    
    
  }
}

// Devuelve Todas Las citas al Admin

export const getAdminAppointmentsService = async () => {
  try {
     const result = await axiosClient.get(`/appointment`)

     return result.data
    
  } catch (error) {
    console.error(error);
    throw error
  }
}
