import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { getUserById } from "../service/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { DevSettings } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { Portal, Dialog, Button, Snackbar } from "react-native-paper";

const PersonalProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // États pour les alertes Material UI
  const [guestModeDialogVisible, setGuestModeDialogVisible] = useState(false);
  const [expiredSessionDialogVisible, setExpiredSessionDialogVisible] =
    useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigation = useNavigation();

  const decode = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.warn("Erreur lors du décodage du token");
      return null;
    }
  };

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const guestMode = await AsyncStorage.getItem("guestMode");

        if (storedToken) {
          setToken(storedToken);
          setIsGuestMode(false);
          return;
        }

        if (guestMode === "true") {
          setIsGuestMode(true);
          setToken(null);
        } else {
          setError("Token d'authentification manquant.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du mode:", err);
        setError("Erreur lors de la vérification de l'authentification.");
      } finally {
        if (!token) {
          setLoading(false);
        }
      }
    };

    fetchMode();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const jwtData = decode(token);

        if (jwtData) {
          await AsyncStorage.setItem("id", JSON.stringify(jwtData.id));
          const userData = await getUserById(jwtData.id, token);

          if (userData && userData[0]) {
            setUser(userData[0]);
          } else {
            setError("Aucune donnée utilisateur trouvée.");
          }
        } else {
          setError("Erreur lors du décodage du token.");
        }
      } catch (err) {
        if (err.message && err.message.includes("Expired JWT Token")) {
          setExpiredSessionDialogVisible(true);
        } else {
          setError("Erreur lors de la récupération des données utilisateur.");
          console.error("Erreur:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Récupérer l'URL de l'image de profil
  const getProfileImageUrl = () => {
    const baseUrl = "https://mobile.sip-academy.com/uploads/coach/";

    if (user && user.logo && user.logo !== "-") {
      return `${baseUrl}${user.logo}`;
    }

    return `${baseUrl}student-68077164d5a8c.jpg`;
  };

  // Navigation vers les sections
  const navigateToDetailsProfile = () => {
    navigation.navigate("DetailsProfil", { user });
  };

  const navigateToParcours = () => {
    navigation.navigate("Parcours", { user });
  };

  const navigateToDeconnexion = () => {
    navigation.navigate("Deconnexion");
  };

  // Navigation correcte vers l'écran de connexion à partir du mode invité
  const navigateToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    );
  };

  // Afficher le loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1F3971" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  // Afficher les erreurs
  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace("Mon Profil")}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher le mode invité
  if (isGuestMode) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-outline" size={50} color="#1F3971" />
        <Text style={styles.noUserText}>
          Connectez-vous pour accéder à plus d'informations sur votre profil.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setGuestModeDialogVisible(true)}
        >
          <Text style={styles.retryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        {/* Dialogue pour mode invité */}
        <Portal>
          <Dialog
            visible={guestModeDialogVisible}
            onDismiss={() => setGuestModeDialogVisible(false)}
          >
            <Dialog.Title>Connexion requise</Dialog.Title>
            <Dialog.Content>
              <Text>
                Vous êtes en mode invité. Connectez-vous pour accéder à votre
                profil.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setGuestModeDialogVisible(false);
                  navigateToLogin();
                }}
              >
                Se connecter
              </Button>
              <Button onPress={() => setGuestModeDialogVisible(false)}>
                Annuler
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  // Vérifier si l'utilisateur a été chargé correctement
  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>
          Impossible de charger les données utilisateur.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace("Mon Profil")}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher le profil utilisateur connecté avec les trois sections
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>

        {/* Section Image de profil et nom */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: getProfileImageUrl(),
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{`${user.prenom} ${user.nom}`}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Menu des 3 sections */}
        <View style={styles.menuContainer}>
          {/* Section 1: Détails Profil */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToDetailsProfile}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Détails Profil</Text>
              <Text style={styles.menuDescription}>
                Informations personnelles et coordonnées
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1F3971" />
          </TouchableOpacity>

          {/* Section 2: Mon Parcours */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToParcours}
          >
            <View
              style={[styles.menuIconContainer, { backgroundColor: "#2E7D32" }]}
            >
              <Ionicons name="trail-sign" size={30} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Mon Parcours</Text>
              <Text style={styles.menuDescription}>
                Expériences, certifications et diplômes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1F3971" />
          </TouchableOpacity>

          {/* Section 3: Déconnexion */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToDeconnexion}
          >
            <View
              style={[styles.menuIconContainer, { backgroundColor: "#C62828" }]}
            >
              <Ionicons name="log-out" size={30} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Déconnexion</Text>
              <Text style={styles.menuDescription}>
                Se déconnecter de l'application
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1F3971" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Portail pour les alertes Material UI */}
      <Portal>
        {/* Dialogue pour la session expirée */}
        <Dialog
          visible={expiredSessionDialogVisible}
          onDismiss={() => setExpiredSessionDialogVisible(false)}
        >
          <Dialog.Title>Session expirée</Dialog.Title>
          <Dialog.Content>
            <Text>Votre session a expiré. Veuillez vous reconnecter.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setExpiredSessionDialogVisible(false);
                AsyncStorage.removeItem("token");
                navigateToLogin();
              }}
            >
              Se connecter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar pour les notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#1F3971",
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  noUserText: {
    marginTop: 10,
    color: "#333",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#1F3971",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F3971",
    textAlign: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1F3971",
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F3971",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1F3971",
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F3971",
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
});

export default PersonalProfileScreen;
