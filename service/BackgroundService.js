import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { getSessions } from "./SessionService";
import { scheduleLocalNotification } from "./NotificationService";

// Définir le nom de la tâche en arrière-plan
const BACKGROUND_FETCH_TASK = "background-session-fetch";

// Enregistrer la tâche en arrière-plan
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Vérifier si l'utilisateur est abonné aux notifications
    const isSubscribed = await AsyncStorage.getItem("subscribedToNewSessions");
    if (isSubscribed !== "true") {
      console.log(
        "Utilisateur non abonné, ignorer la vérification en arrière-plan"
      );
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Récupérer le dernier temps de fetch
    let lastFetchTime = await AsyncStorage.getItem("lastSessionFetchTime");
    if (!lastFetchTime) {
      lastFetchTime = new Date().toISOString();
      await AsyncStorage.setItem("lastSessionFetchTime", lastFetchTime);
    }

    // Récupérer les sessions
    const sessionData = await getSessions();
    if (!sessionData || !sessionData["hydra:member"]) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const allSessions = sessionData["hydra:member"];

    // Filtrer les nouvelles sessions
    const newSessions = allSessions.filter((session) => {
      const sessionCreationDate = new Date(
        session.createdat || session.starttime
      );
      return sessionCreationDate > new Date(lastFetchTime);
    });

    if (newSessions.length > 0) {
      console.log(
        `${newSessions.length} nouvelles sessions trouvées en arrière-plan`
      );

      // Envoyer une notification pour chaque nouvelle session
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

      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      console.log("Aucune nouvelle session trouvée en arrière-plan");
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification en arrière-plan:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Enregistrer la tâche en arrière-plan
export const registerBackgroundFetch = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 3600, // Vérifier toutes les heures (en secondes)
      stopOnTerminate: false, // Continuer à s'exécuter après la fermeture de l'application
      startOnBoot: true, // Démarrer après le redémarrage de l'appareil
    });
    console.log("Tâche en arrière-plan enregistrée avec succès");
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de la tâche en arrière-plan:",
      error
    );
    return false;
  }
};

// Désactiver la tâche en arrière-plan
export const unregisterBackgroundFetch = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    console.log("Tâche en arrière-plan désactivée avec succès");
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de la désactivation de la tâche en arrière-plan:",
      error
    );
    return false;
  }
};

// Vérifier si la tâche en arrière-plan est enregistrée
export const isBackgroundFetchRegistered = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );

  return (
    status === BackgroundFetch.BackgroundFetchStatus.Available && isRegistered
  );
};
