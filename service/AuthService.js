import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL3 } from "@env";

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

      // Stocker également les informations utilisateur
      if (data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // Si data.user n'existe pas, vous devrez peut-être faire une requête séparée
        // pour obtenir les informations de l'utilisateur à l'aide du token
        const userInfo = await fetchUserInfo(data.token);
        await AsyncStorage.setItem("user", JSON.stringify(userInfo));
      }
    }

    return data;
  } catch (error) {
    console.error("Erreur de connexion:", error.message || error);
    throw error;
  }
};

// Fonction pour récupérer les informations de l'utilisateur si nécessaire
const fetchUserInfo = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL2}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    return null;
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
    await AsyncStorage.removeItem("user");
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
// Dans AuthService.js, assurez-vous que ces fonctions retournent les bonnes valeurs
export const getCurrentUser = async () => {
  try {
    const userJSON = await AsyncStorage.getItem("user");
    const user = userJSON ? JSON.parse(userJSON) : null;
    console.log(
      "getCurrentUser - Utilisateur récupéré depuis AsyncStorage:",
      user
    );
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

export const fetchUserProfileFromAPI = async (token) => {
  try {
    // Vérifiez cette URL - elle retourne une 404
    const response = await axios.get(`${API_BASE_URL3}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur API profil:", error);
    throw error;
  }
};
