import axiosClient from "./axios.config";

/* 

Recuerda! La Respuesta de Axios es:

result = {
  data: [...],        // ← la respuesta real del servidor
  status: 200,
  headers: {...},
  config: {...}
}


Por eso cogemos result.data 

*/


export const getEmployeesService = async () => {

    try {
       const result = await axiosClient.get("/employee")
       return result.data

    } catch (error) {
        console.error(error);  
    }

}




