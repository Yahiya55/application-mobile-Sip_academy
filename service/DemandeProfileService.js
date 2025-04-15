import axios from "axios";
import { API_BASE_URL1 } from "@env";

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL1}/demandeprofils`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Réponse API:", data);

    if (
      data["hydra:member"] &&
      Array.isArray(data["hydra:member"]) &&
      data["hydra:member"].length > 0
    ) {
      return data["hydra:member"][0]; // Si le profil est trouvé, le retourner
    } else {
      throw new Error("Aucun profil trouvé.");
    }
  } catch (error) {
    console.error("Erreur dans la récupération du profil:", error.message); // Affichage de l'erreur
    throw error; // Relance l'erreur pour gestion dans le composant appelant
  }
};
