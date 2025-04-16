import React, { useState } from "react";
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
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Portal, Dialog, Button, Snackbar } from "react-native-paper";

// Import du contexte d'authentification
import { useAuth } from "../context/AuthContext";

const PersonalProfileScreen = () => {
  // Récupérer les variables et méthodes depuis le AuthContext
  const { isLoading, userData, userToken, isGuestMode, logout } = useAuth();

  // États locaux pour la gestion des dialogues et des notifications
  const [guestModeDialogVisible, setGuestModeDialogVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigation = useNavigation();

  // Navigation vers l'écran de connexion (AuthStack)
  const navigateToLogin = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        })
      );
    } else {
      navigation.navigate("Auth");
    }
  };

  // Gestion de la déconnexion via le AuthContext
  const handleLogout = async () => {
    try {
      await logout();
      setSnackbarMessage("Déconnexion réussie");
      setSnackbarVisible(true);
      // La navigation vers l'écran d'authentification se fera via le RootNavigator
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setSnackbarMessage("Impossible de vous déconnecter. Veuillez réessayer.");
      setSnackbarVisible(true);
    }
  };

  // Affichage d'un indicateur de chargement si le contexte est en train de charger
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1F3971" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  // Si l'utilisateur est en mode invité (ou s'il n'y a pas de token), on affiche un message
  if (isGuestMode || !userToken) {
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

        {/* Dialogue pour inviter l'utilisateur à se connecter */}
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

  // Si les données utilisateur ne sont pas disponibles, on affiche une erreur
  if (!userData) {
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

  // Affichage du profil utilisateur lorsque l'utilisateur est connecté et les données sont disponibles
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
          <Text
            style={styles.userName}
          >{`${userData.prenom} ${userData.nom}`}</Text>
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
                value={`${userData.prenom} ${userData.nom}`}
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
                value={userData.email}
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
                value={userData.tel1 || "Non spécifié"}
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
                value={userData.tel2 || "Non spécifié"}
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
                value={userData.adresse || "Non spécifiée"}
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
                value={userData.linkedin || "Non spécifié"}
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
                value={userData.facebook || "Non spécifié"}
                editable={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Portail pour les dialogues (déconnexion, session expirée, etc.) */}
      <Portal>
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
      </Portal>

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
