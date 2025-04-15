import React, { createContext,useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Notification, NotificationResponse, EventSubscription } from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../utils/registreForPushNotificationsAsync';

interface INotificationContext {
  expoPushToken: string | null;
  notification: Notification | null;
  sendNotification: (message: any) => Promise<void>;
}

interface INotificationProviderProps {
  children: ReactNode;
}

// Création du contexte
export const NotificationContext = createContext<INotificationContext | undefined>(undefined);

// Fournisseur du contexte
export const NotificationProvider: React.FC<INotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  // Initialisation des notifications
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? null))
      .catch(error => console.error('Erreur lors de l’enregistrement des notifications:', error));

    // Écouteur pour les notifications reçues
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Écouteur pour les réponses aux notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Réponse à la notification :', response);
    });

    // Nettoyage des abonnements
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Fonction pour envoyer une notification
  const sendNotification = async (message: any) => {
    if (!expoPushToken) {
      console.error("Le token Expo push n'est pas disponible !");
      return;
    }
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: 'default',
          ...message,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de l’envoi de la notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
