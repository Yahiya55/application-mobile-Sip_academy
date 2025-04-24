import axios from "axios";
import { API_BASE_URL3, API_BASE_URL4 } from "@env";

// Fonction pour récupérer les vidéos
export const fetchVideos = async () => {
  try {
    console.log("Récupération des vidéos depuis:", `${API_BASE_URL3}/videos`);
    const response = await axios.get(`${API_BASE_URL3}/videos`);
    console.log("Données vidéos reçues:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    throw error;
  }
};

// Fonction pour générer l'URL complète de la vidéo
export const getVideoUrl = (video) => {
  // Encoder l'URL pour gérer les espaces et caractères spéciaux
  const encodedVideo = encodeURIComponent(video);
  const url = `${API_BASE_URL4}/uploads/video/${encodedVideo}`;
  console.log("URL vidéo générée:", url);
  return url;
};

// Fonction pour générer l'URL complète de l'image de couverture
export const getVideoCoverUrl = (cover) => {
  if (!cover) return null;

  const encodedCover = encodeURIComponent(cover);
  const url = `${API_BASE_URL4}/uploads/covers/${encodedCover}`;
  console.log("URL cover générée:", url);
  return url;
};
