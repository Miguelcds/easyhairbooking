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

export const cancelAppointmentService = async (id, appointmentData) => {
  try {
    const result = await axiosClient.patch(`/appointment/${id}`, appointmentData)

    return result.data
    
  } catch (error) {
    console.error(error);
    throw error
    
    
  }
}
