import axios from "axios";
import { API_BASE_URL3, API_BASE_URL1 } from "@env";

export const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL3}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/ld+json", // Ajouté pour compatibilité API Platform
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans getUserById:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des informations de l'utilisateur"
    );
  }
};

/**
 * @param {number} userId - ID de l'utilisateur
 * @param {FormData} formData - Données du formulaire (incluant les fichiers)
 * @param {string} token - Token d'authentification
 * @returns {Promise<Object>} - Réponse du serveur contenant les données mises à jour
 */
export const updateUserProfile = async (userId, formData, token) => {
  try {
    console.log(
      `Envoi de la requête PUT à ${API_BASE_URL3}/updateprofile/${userId}`
    );
    console.log("Token utilisé:", token);

    const response = await axios.put(
      `${API_BASE_URL3}/updateprofile/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    console.log("Réponse du serveur:", response.status, response.data);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Erreur dans updateUserProfile:", error);
    if (error.response) {
      console.error("Statut de la réponse:", error.response.status);
      console.error("Données de la réponse:", error.response.data);
    }
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.["hydra:description"] ||
        "Erreur lors de la mise à jour du profil"
    );
  }
};
