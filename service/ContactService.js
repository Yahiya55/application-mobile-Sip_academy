import axios from "axios";
import { API_BASE_URL } from "@env";

export const contactService = async (messageData) => {
  try {
    // Extraire le token reCAPTCHA
    const { recaptchaToken, ...contactData } = messageData;

    // Vérifier le token reCAPTCHA avec l'API Google
    const recaptchaVerificationData = new URLSearchParams();
    recaptchaVerificationData.append(
      "secret",
      "6LcywtkqAAAAAJylRbNGz1QFu0mxlYKo3Dt31lrT"
    );
    recaptchaVerificationData.append("response", recaptchaToken);

    const recaptchaVerification = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      recaptchaVerificationData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Si la vérification échoue, rejeter la demande
    if (!recaptchaVerification.data.success) {
      throw new Error("Vérification reCAPTCHA échouée");
    }

    // Si la vérification réussit, envoyer le message au serveur
    const response = await axios.post(`${API_BASE_URL}/contacts`, contactData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error.message || error);
    throw new Error("Erreur lors de l'envoi du message");
  }
};
