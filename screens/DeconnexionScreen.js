import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DevSettings } from "react-native";
import { Dialog, Button, Snackbar } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';

const DeconnexionScreen = () => {
  const navigation = useNavigation();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { setUserToken } = useAuth();



  const handleLogout = async () => {
    try {
      console.log("Tentative de déconnexion...");
      await AsyncStorage.removeItem("token");
      setUserToken("")
      console.log("Token supprimé!");

      // Afficher l'alerte de déconnexion réussie
      setSnackbarMessage("Déconnexion réussie");
      setSnackbarVisible(true);
      // Recharger l'application après un court délai

    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setSnackbarMessage("Impossible de vous déconnecter. Veuillez réessayer.");
      setSnackbarVisible(true);
    }
  };

  const navigateToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F3971" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Déconnexion</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="log-out" size={80} color="#C62828" />
        </View>

        <Text style={styles.title}>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </Text>
        <Text style={styles.description}>
          Vous serez redirigé vers l'écran de connexion et devrez entrer à
          nouveau vos identifiants pour accéder à votre compte.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutDialogVisible(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          <Button onPress={() => setLogoutDialogVisible(false)}>Annuler</Button>
        </Dialog.Actions>
      </Dialog>

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
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F3971",
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F3971",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#C62828",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DeconnexionScreen;
