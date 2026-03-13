import axiosClient from "./axios.config";

export const registerService = async (userData) => {
  try {
    if (userData === null) {
      throw new Error("No hay Datos que arrojar a la BBDD ⚠️");
    }
    const result = await axiosClient.post("/auth/register", userData);
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const loginService = async (userData) => {
    try {
        if(userData === null ){
            throw new Error("No ha datos de usuario con los que puedas Loggearte");
        }
        const result = await axiosClient.post("/auth/login", userData);
        return result.data;
  
    } catch (error) {
        console.log(error);
        throw error;
    }
}
