import axios from "axios";
import { API_BASE_URL } from "@env";

export const getSessions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/evenements`);
    return response.data;
  } catch (error) {
    console.error("Erreur dans getSessions:", error.message || error);
    throw new Error("Erreur lors de la récupération des sessions");
  }
};
export const getSessionsById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/evenements/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Erreur dans getSessionsById:", error.message || error);
    throw new Error("Erreur lors de la récupération des détails de la session");
  }
};