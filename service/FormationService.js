import axios from "axios";
import { API_BASE_URL } from "@env";

export const FormationsService = {
  getFormations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/formations`);
      return response.data;
    } catch (error) {
      console.log("Erreur API:", error);
      throw error;
    }
  },

  getFormationsdetails: async (id) => {
    if (!id) {
      console.error("ID manquant ou invalide");
      throw new Error("ID manquant ou invalide");
    }

    try {
      console.log(
        `Requête API pour l'ID ${id}: ${API_BASE_URL}/formations/${id}`
      );
      const response = await axios.get(`${API_BASE_URL}/formations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },
};
