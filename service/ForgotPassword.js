import axios from "axios";
import { API_BASE_URL3 } from "@env";

export const ForgotPasswordService = {
  /**
   * Envoie une demande de réinitialisation de mot de passe.
   * @param {string} email - L'adresse email de l'utilisateur.
   * @returns {Promise} - La promesse résolue avec la réponse du serveur.
   */
  requestPasswordReset: async (email) => {
    if (!email) {
      console.error("Email manquant ou invalide");
      throw new Error("Email manquant ou invalide");
    }

    try {
      console.log(`Envoi de la demande de réinitialisation pour ${email}`);
      const response = await axios.post(
        `${API_BASE_URL3}/reset-password/request`,
        {
          email,
        }
      );
      console.log("Réponse API:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      throw error;
    }
  },

  /**
   * Réinitialise le mot de passe avec un jeton.
   * @param {string} token - Le jeton de réinitialisation.
   * @param {string} password - Le nouveau mot de passe.
   * @returns {Promise} - La promesse résolue avec la réponse du serveur.
   */
  resetPassword: async (token, password) => {
    if (!token || !password) {
      console.error("Token ou mot de passe manquant");
      throw new Error("Token ou mot de passe manquant");
    }

    try {
      console.log("Réinitialisation du mot de passe en cours...");
      const response = await axios.post(
        `${API_BASE_URL3}/reset-password/reset`,
        {
          token,
          password,
        }
      );
      console.log("Réponse API:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      throw error;
    }
  },
};
