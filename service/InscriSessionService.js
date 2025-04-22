import axios from "axios";
import { API_BASE_URL3 } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur lors du décodage du JWT:", error);
    return null;
  }
};

export const getMesSessions = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Aucun token d'authentification trouvé");
    }

    const decodedToken = decodeJWT(token);

    if (!decodedToken || !decodedToken.id) {
      console.warn(
        "Impossible de récupérer l'ID depuis le token, utilisation de méthode alternative"
      );

      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.id) {
        throw new Error("Impossible de récupérer l'ID de l'utilisateur");
      }

      return await fetchSessionsWithUserId(user.id, token);
    }

    console.log(
      `Récupération des sessions pour l'utilisateur ID: ${decodedToken.id}`
    );
    return await fetchSessionsWithUserId(decodedToken.id, token);
  } catch (error) {
    console.error(
      "Erreur dans getMesSessions:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des sessions inscrites"
    );
  }
};

const fetchSessionsWithUserId = async (userId, token) => {
  const response = await axios.get(`${API_BASE_URL3}/mesSessions/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/ld+json",
    },
  });

  if (response.status !== 200) {
    throw new Error(`Erreur HTTP! statut: ${response.status}`);
  }

  return response.data;
};
