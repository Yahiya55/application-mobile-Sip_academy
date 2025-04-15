import axios from "axios";
import { API_BASE_URL } from "@env";


export const ActualiteService={
    getActualite: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/actualites/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erreur API:", error);
            throw error;
        }
    },
    getActualites : async () => {
  try {
    const response = await axios.get(`${API_BASE_URL + "/actualites"}`);
    return response.data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
},



}
