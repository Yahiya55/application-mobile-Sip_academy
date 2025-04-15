import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
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
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
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

        // Vérifier d'abord s'il y a un token valide
        if (storedToken) {
          setToken(storedToken);
          setIsGuestMode(false); // Assurer que le mode invité est désactivé si un token existe
          return; // Sortir de la fonction car le token existe
        }

        // Si aucun token, vérifier le mode invité
        if (guestMode === "true") {
          setIsGuestMode(true);
          setToken(null);
        } else {
          // Si ni token ni mode invité, il y a une erreur
          setError("Token d'authentification manquant.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du mode:", err);
        setError("Erreur lors de la vérification de l'authentification.");
      } finally {
        if (!token) {
          setLoading(false); // Arrêter le chargement si pas de token
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
          // Afficher l'alerte Material UI pour la session expirée
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

  const reloadApp = () => {
    console.log("Rechargement de l'application...");
    DevSettings.reload();
  };

  const handleLogout = async () => {
    try {
      console.log("Tentative de déconnexion...");
      await AsyncStorage.removeItem("token");
      console.log("Token supprimé!");

      // Afficher l'alerte de déconnexion réussie
      setSnackbarMessage("Déconnexion réussie");
      setSnackbarVisible(true);

      // Recharger l'application après un court délai
      setTimeout(() => {
        reloadApp();
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setSnackbarMessage("Impossible de vous déconnecter. Veuillez réessayer.");
      setSnackbarVisible(true);
    }
  };

  // Navigation correcte vers l'écran de connexion à partir du mode invité
  const navigateToLogin = () => {
    // Navigation vers l'écran de connexion dans le AuthStack
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

  // Afficher le profil utilisateur connecté
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutDialogVisible(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: "https://mobile.sip-academy.com/uploads/coach/avatar-67f3d2d56c30b.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{`${user.prenom} ${user.nom}`}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="person"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={`${user.prenom} ${user.nom}`}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="mail"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.email}
                editable={false}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Coordonnées</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone principal</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="call"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.tel1 || "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone secondaire</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.tel2 || "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="location"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.adresse || "Non spécifiée"}
                editable={false}
                multiline={true}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Réseaux sociaux</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LinkedIn</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="logo-linkedin"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.linkedin || "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Facebook</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="logo-facebook"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.facebook || "Non spécifié"}
                editable={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Portail pour les alertes Material UI */}
      <Portal>
        {/* Dialogue pour la déconnexion */}
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Déconnexion</Dialog.Title>
          <Dialog.Content>
            <Text>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setLogoutDialogVisible(false);
                handleLogout();
              }}
            >
              Confirmer
            </Button>
            <Button onPress={() => setLogoutDialogVisible(false)}>
              Annuler
            </Button>
          </Dialog.Actions>
        </Dialog>

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
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#1F3971",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F3971",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});

export default PersonalProfileScreen;
