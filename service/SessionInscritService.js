import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL3 } from "@env";
import { getCurrentUser } from "./UserService";

export const SessionInscritService = {
  getMesSessions: async () => {
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Utilisateur non connecté");
      }

      // Récupérer les informations de l'utilisateur courant
      const currentUser = await getCurrentUser(token);
      const userId = currentUser.id; // Assumant que l'ID est disponible dans la réponse

      // Maintenant utiliser l'ID utilisateur pour l'appel API
      const response = await axios.get(
        `${API_BASE_URL3}/mesSessions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/ld+json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des sessions inscrites:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
