import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken, onMessage } from "firebase/messaging";

import { messaging } from "../firebaseConfig";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    sound: "notification-sound.wav",
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    try {
      // Obtenir le token Expo
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;

      // Stocker le token Expo localement
      await AsyncStorage.setItem("expoPushToken", token);
      console.log("Expo Push Token:", token);

      // Essayer d'obtenir le token FCM si Firebase est correctement initialisé
      if (messaging) {
        // La vapidKey est nécessaire uniquement pour les notifications Web
        const fcmToken = await getToken(messaging, {
          vapidKey:
            "BPNfQYPGJ8P8IHK2qQASFJq91Oh_VXJbPLPFKqQyoOXoVfUQyHnt5c8NWOL7PHFPMr5PUcWR9FHD8t22e8uYyOw",
        });

        // Stocker le token FCM localement
        if (fcmToken) {
          await AsyncStorage.setItem("fcmToken", fcmToken);
          console.log("FCM Token:", fcmToken);

          // Envoyer les tokens au backend
          await sendTokenToBackend(token, fcmToken);
        }
      }
    } catch (error) {
      console.error("Error getting push tokens:", error);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
};

// Envoyer le token à votre propre service
const sendTokenToBackend = async (expoToken, fcmToken) => {
  try {
    // Récupérer le token d'authentification de l'utilisateur
    const authToken = await AsyncStorage.getItem("token");

    if (!authToken) {
      console.log("User not authenticated, skipping token registration");
      return;
    }

    // Implémentation de l'appel API pour enregistrer le token
    console.log("Sending notification tokens to backend...");

    // Remplacez cette partie par un appel API réel à votre backend
    // const response = await fetch(`${API_BASE_URL}/push-tokens`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authToken}`
    //   },
    //   body: JSON.stringify({
    //     expoToken,
    //     fcmToken,
    //     deviceInfo: {
    //       platform: Platform.OS,
    //       model: Device.modelName
    //     }
    //   })
    // });

    console.log("Tokens sent successfully to backend");
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};

// S'abonner à un topic pour les notifications de nouvelles sessions
export const subscribeToSessionNotifications = async () => {
  try {
    // Vérifier si l'utilisateur est authentifié
    const authToken = await AsyncStorage.getItem("token");

    if (!authToken) {
      console.log("User not authenticated, skipping subscription");
      return false;
    }

    // Ici, vous utiliseriez une fonction FCM pour s'abonner à un topic,
    // comme messaging.subscribeToTopic('newSessions')
    // Pour Expo, nous allons simuler cet abonnement
    await AsyncStorage.setItem("subscribedToNewSessions", "true");

    // Vérifier immédiatement s'il y a de nouvelles sessions
    const lastFetchTime = await AsyncStorage.getItem("lastSessionFetchTime");
    await checkForNewSessions(
      lastFetchTime ? new Date(lastFetchTime) : new Date()
    );

    console.log("Successfully subscribed to session notifications");
    return true;
  } catch (error) {
    console.error("Error subscribing to new sessions:", error);
    return false;
  }
};

// Se désabonner des notifications de nouvelles sessions
export const unsubscribeFromSessionNotifications = async () => {
  try {
    await AsyncStorage.setItem("subscribedToNewSessions", "false");
    console.log("Successfully unsubscribed from session notifications");
    return true;
  } catch (error) {
    console.error("Error unsubscribing from new sessions:", error);
    return false;
  }
};

// Vérifier périodiquement les nouvelles sessions
export const checkForNewSessions = async (lastFetchTime) => {
  // Cette fonction vérifie les nouvelles sessions
  try {
    console.log(`Checking for new sessions since ${lastFetchTime}`);

    // Vérifier si l'utilisateur est abonné aux notifications
    const isSubscribed = await AsyncStorage.getItem("subscribedToNewSessions");
    if (isSubscribed !== "true") {
      console.log("User not subscribed to notifications, skipping check");
      return [];
    }

    const { getSessions } = require("../service/SessionService");
    const sessions = await getSessions();

    if (!sessions || !sessions["hydra:member"]) {
      console.log("No sessions found or invalid response format");
      return [];
    }

    const allSessions = sessions["hydra:member"];
    const newSessions = allSessions.filter((session) => {
      const sessionCreationDate = new Date(
        session.createdat || session.starttime
      );
      return sessionCreationDate > lastFetchTime;
    });

    console.log(`Found ${newSessions.length} new sessions`);

    if (newSessions.length > 0) {
      // Envoyer une notification locale pour chaque nouvelle session
      for (const session of newSessions) {
        await scheduleLocalNotification(
          "Nouvelle session disponible",
          `${session.titre} - ${
            session.starttime
              ? new Date(session.starttime).toLocaleDateString()
              : "Date à confirmer"
          }`
        );
      }

      // Mettre à jour le dernier temps de fetch
      await AsyncStorage.setItem(
        "lastSessionFetchTime",
        new Date().toISOString()
      );
    }

    return newSessions;
  } catch (error) {
    console.error("Error checking for new sessions:", error);
    return [];
  }
};

// Planifier une notification locale
export const scheduleLocalNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Notification immédiate
    });
    console.log(`Local notification scheduled: ${title} - ${body}`);
  } catch (error) {
    console.error("Error scheduling local notification:", error);
  }
};

// Configurer les écouteurs de notifications
export const setupNotificationListeners = (navigation) => {
  // Pour les notifications reçues lorsque l'app est au premier plan
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received in foreground:", notification);
    }
  );

  // Pour les notifications interactives (l'utilisateur clique sur la notification)
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);

      // Naviguer vers l'écran des sessions
      if (navigation) {
        navigation.navigate("Sessions");
      }
    });

  // Écouter les messages FCM si Firebase est correctement initialisé
  let messageUnsubscribe = () => {};
  if (messaging) {
    messageUnsubscribe = onMessage(messaging, (message) => {
      console.log("New FCM message:", message);

      // Convertir le message FCM en notification locale
      if (message.notification) {
        scheduleLocalNotification(
          message.notification.title,
          message.notification.body
        );
      }
    });
  }

  // Retourner une fonction pour nettoyer les abonnements
  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
    // Pas besoin de nettoyer messageUnsubscribe car ce n'est pas une fonction remove()
  };
};

// Fonction pour démarrer le service de vérification périodique
export const startPeriodicSessionCheck = async () => {
  // Récupérer le dernier temps de fetch
  let lastFetchTime = await AsyncStorage.getItem("lastSessionFetchTime");

  if (!lastFetchTime) {
    lastFetchTime = new Date().toISOString();
    await AsyncStorage.setItem("lastSessionFetchTime", lastFetchTime);
  }

  // Vérifier les nouvelles sessions immédiatement
  await checkForNewSessions(new Date(lastFetchTime));

  // Configurer une vérification périodique
  const intervalId = setInterval(async () => {
    lastFetchTime = await AsyncStorage.getItem("lastSessionFetchTime");
    await checkForNewSessions(new Date(lastFetchTime));
  }, 3600000); // Vérifier toutes les heures

  return intervalId;
};

// Arrêter les vérifications périodiques
export const stopPeriodicSessionCheck = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log("Periodic session check stopped");
  }
};
export const simulateNewSession = async () => {
  try {
    console.log("Simulation d'une nouvelle session détectée");

    // Créer une session factice
    const mockSession = {
      id: "test-session-" + Date.now(),
      titre: "Session de test",
      starttime: new Date(Date.now() + 86400000).toISOString(), // demain
      endtime: new Date(Date.now() + 172800000).toISOString(), // après-demain
      createdat: new Date().toISOString(),
      descriptionshort:
        "<p>Ceci est une session de test pour les notifications</p>",
    };

    // Envoyer une notification locale pour cette session
    await scheduleLocalNotification(
      "Nouvelle session disponible",
      `${mockSession.titre} - ${new Date(
        mockSession.starttime
      ).toLocaleDateString()}`
    );

    console.log(
      "Notification de test envoyée pour simuler une nouvelle session"
    );

    // Optionnellement, ajouter temporairement cette session au storage
    // pour voir si elle apparaît dans la liste au clic sur la notification
    const currentSessions = await AsyncStorage.getItem("cachedSessions");
    const sessions = currentSessions ? JSON.parse(currentSessions) : [];
    sessions.unshift(mockSession);
    await AsyncStorage.setItem("cachedSessions", JSON.stringify(sessions));

    return mockSession;
  } catch (error) {
    console.error("Erreur lors de la simulation:", error);
    return null;
  }
};
