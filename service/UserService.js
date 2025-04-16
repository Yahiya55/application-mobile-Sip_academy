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
// Dans userService.js
export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL1}/demandeprofils`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/ld+json",
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Erreur dans getCurrentUser:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des informations de l'utilisateur actuel"
    );
  }
};