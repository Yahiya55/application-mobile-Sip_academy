import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL3 } from "@env";

/**
 * Récupère les détails d'une classe virtuelle spécifique par son ID
 * @param {number} id - L'ID de la classe virtuelle
 * @returns {Promise} - Les détails de la classe virtuelle
 */
export const getClasseVirtuelleDetails = async (id) => {
  try {
    // Récupérer le token d'authentification
    const token = await AsyncStorage.getItem("token");

    // Configurer les headers avec le token si disponible
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Effectuer la requête API
    const response = await axios.get(`${API_BASE_URL3}/classeVirtuelle/${id}`, {
      headers,
    });

    // Retourner les données de la réponse
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de la classe virtuelle:",
      error
    );
    throw error;
  }
};

/**
 * Récupère toutes les classes virtuelles associées à une session
 * @param {number} sessionId - L'ID de la session
 * @returns {Promise} - Liste des classes virtuelles de la session
 */
export const getClassesVirtuellesBySession = async (sessionId) => {
  try {
    // Récupérer le token d'authentification
    const token = await AsyncStorage.getItem("token");

    // Configurer les headers avec le token si disponible
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Effectuer la requête API
    const response = await axios.get(
      `${API_BASE_URL3}/session/${sessionId}/classesVirtuelles`,
      {
        headers,
      }
    );

    // Retourner les données de la réponse
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des classes virtuelles de la session:",
      error
    );
    throw error;
  }
};
