import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL1, API_BASE_URL2 } from "@env";

/**
 * Authentification utilisateur via API_BASE_URL1
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} - Informations utilisateur et token
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL1}/login_check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Échec de la connexion");
    }

    // Stocker le token utilisateur
    if (data.token) {
      await AsyncStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Erreur de connexion:", error.message || error);
    throw error;
  }
};

/**
 * Inscription utilisateur via API_BASE_URL2
 * @param {Object} userData - Données d'inscription utilisateur
 * @returns {Promise<Object>} - Informations utilisateur et message de succès
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL2}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    if (!response.status === 200) {
      throw new Error(data.message || "Échec de l'inscription");
    }

    // Retourner les détails d'inscription, y compris le code de vérification
    return {
      success: true,
      message: data.message,
      verificationCode: data.verification_code,
    };
  } catch (error) {
    console.error(
      "Erreur d'inscription:",
      error.response?.data?.message || error.message
    );
    throw new Error("Erreur lors de l'inscription");
  }
};

/**
 * Déconnexion utilisateur
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw new Error("Erreur lors de la déconnexion");
  }
};

/**
 * Réinitialisation de mot de passe via API_BASE_URL1
 * @param {string} email - Email utilisateur
 * @returns {Promise<Object>} - Résultat de la demande
 */
export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL1}/password/forgot`, {
      email,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Échec de la réinitialisation du mot de passe");
    }
  } catch (error) {
    console.error(
      "Erreur de réinitialisation de mot de passe:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Vérifier si l'utilisateur est connecté
 * @returns {Promise<boolean>} - true si connecté, false sinon
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  } catch (error) {
    console.error("Erreur de vérification d'authentification:", error);
    return false;
  }
};

/**
 * Récupérer les informations de l'utilisateur connecté
 * @returns {Promise<Object|null>} - Objet utilisateur ou null
 */
export const getCurrentUser = async () => {
  try {
    const userString = await AsyncStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Erreur de récupération des données utilisateur:", error);
    return null;
  }
};
