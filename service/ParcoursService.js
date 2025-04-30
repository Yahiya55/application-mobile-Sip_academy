import axios from "axios";
import { API_BASE_URL3 } from "@env";

// ============== Service Experience ==============
const experienceApiClient = axios.create({
  baseURL: `${API_BASE_URL3}/experience`,
  headers: {
    "Content-Type": "application/json",
  },
});

const addExperience = async (experienceData) => {
  try {
    const response = await experienceApiClient.post("/add/153", experienceData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'expérience :", error.message);

    if (error.message === "Network Error") {
      throw new Error(
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
      );
    }

    if (error.response) {
      // Le serveur a répondu avec un statut en dehors de la plage 2xx
      throw new Error(`Erreur serveur : ${error.response.status}`);
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse reçue
      throw new Error("Aucune réponse du serveur. Réessayez plus tard.");
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error(
        "Une erreur est survenue. Vérifiez votre connexion et réessayez."
      );
    }
  }
};

// ============== Service Certificat ==============
const certificatApiClient = axios.create({
  baseURL: `${API_BASE_URL3}/certificat`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const addCertificat = async (certificatData) => {
  try {
    const formData = new FormData();
    formData.append("titre", certificatData.titre);
    formData.append("lien", certificatData.lien);
    formData.append("dateobtention", certificatData.dateobtention);
    formData.append("datevalidite", certificatData.datevalidite);

    // Ajouter les fichiers (PDF et image)
    if (certificatData.pdf) {
      formData.append("pdf", {
        uri: certificatData.pdf.uri,
        name: certificatData.pdf.name,
        type: certificatData.pdf.type,
      });
    }

    if (certificatData.image) {
      formData.append("image", {
        uri: certificatData.image.uri,
        name: certificatData.image.name,
        type: certificatData.image.type,
      });
    }

    const response = await certificatApiClient.post("/add/153", formData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du certificat :", error.message);

    if (error.message === "Network Error") {
      throw new Error(
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
      );
    }

    if (error.response) {
      // Le serveur a répondu avec un statut en dehors de la plage 2xx
      throw new Error(`Erreur serveur : ${error.response.status}`);
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse reçue
      throw new Error("Aucune réponse du serveur. Réessayez plus tard.");
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error(
        "Une erreur est survenue. Vérifiez votre connexion et réessayez."
      );
    }
  }
};

// ============== Service Diplôme ==============
const diplomeApiClient = axios.create({
  baseURL: `${API_BASE_URL3}/diplome`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const addDiplome = async (diplomeData) => {
  try {
    const formData = new FormData();
    formData.append("titre", diplomeData.titre);
    formData.append("dateobtention", diplomeData.dateobtention);

    // Ajouter les fichiers (PDF et image)
    if (diplomeData.pdf) {
      formData.append("pdf", {
        uri: diplomeData.pdf.uri,
        name: diplomeData.pdf.name,
        type: diplomeData.pdf.type,
      });
    }

    if (diplomeData.image) {
      formData.append("image", {
        uri: diplomeData.image.uri,
        name: diplomeData.image.name,
        type: diplomeData.image.type,
      });
    }

    const response = await diplomeApiClient.post("/add/153", formData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du diplôme :", error.message);

    if (error.message === "Network Error") {
      throw new Error(
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
      );
    }

    if (error.response) {
      // Le serveur a répondu avec un statut en dehors de la plage 2xx
      throw new Error(`Erreur serveur : ${error.response.status}`);
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse reçue
      throw new Error("Aucune réponse du serveur. Réessayez plus tard.");
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error(
        "Une erreur est survenue. Vérifiez votre connexion et réessayez."
      );
    }
  }
};

export default {
  addExperience,
  addCertificat,
  addDiplome,
};
