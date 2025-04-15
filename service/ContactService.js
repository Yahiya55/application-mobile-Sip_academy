import axios from "axios";
import { API_BASE_URL } from "@env";

export const contactService = async (messageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contacts`, messageData);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error.message || error);
    throw new Error("Erreur lors de l'envoi du message");
  }
};
