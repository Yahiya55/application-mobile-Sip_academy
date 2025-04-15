import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// Import du service ForgotPassword
import { ForgotPasswordService } from "../service/ForgotPassword";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigation = useNavigation();

  const handleResetPassword = async () => {
    // Validation de l'email
    if (!email) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Appel au service ForgotPasswordService
      await ForgotPasswordService.requestPasswordReset(email);

      setIsLoading(false);
      setSuccess(
        "Un lien de réinitialisation a été envoyé à votre adresse e-mail."
      );

      // Optionnel : rediriger vers la page de connexion après quelques secondes
      setTimeout(() => {
        navigation.navigate("Login");
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      setError(
        "Une erreur s'est produite. Veuillez vérifier votre adresse e-mail ou réessayer plus tard."
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1F3971" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Logo SIPACADEMY */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/sipwhite.png")}
          />
        </View>

        {/* Formulaire de réinitialisation */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Mot de passe oublié</Text>
          <Text style={styles.subtitle}>
            Entrez votre adresse e-mail et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </Text>

          {/* Affichage des erreurs */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Affichage du succès */}
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          {/* Champ Email */}
          <View style={styles.inputContainer}>
            <Icon
              name="email-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          {/* Bouton d'envoi */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? "Envoi en cours..." : "ENVOYER"}
            </Text>
          </TouchableOpacity>

          {/* Lien vers la page de connexion (en bas) */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Vous vous souvenez de votre mot de passe?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}> Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ©2024 Smart It Partner - Tous droits réservés
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    padding: 30,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F3971",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1F3971",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#1F3971",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footerText: {
    color: "#999",
    fontSize: 12,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  successText: {
    color: "green",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
