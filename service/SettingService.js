import axios from "axios";
import { API_BASE_URL } from "@env";

export const getSetting = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error("Erreur dans getSessions:", error.message || error);
    throw new Error("Erreur lors de la récupération des sessions");
  }
};
