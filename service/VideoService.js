import axios from "axios";
import { API_BASE_URL } from "@env";

export const getVideos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos`);
    return response.data["hydra:member"];
  } catch (error) {
    console.error("Erreur dans getVideos:", error.message || error);
    throw new Error("Erreur lors de la récupération des vidéos");
  }
};
