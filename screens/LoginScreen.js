import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { login } from "../service/AuthService.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./LoadingScreen";
import { DevSettings } from "react-native"; // Import DevSettings pour le rechargement

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Fonction pour recharger l'application
  const reloadApp = () => {
    console.log("Rechargement de l'application...");
    DevSettings.reload(); // Méthode pour recharger complètement l'application
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Tentative de connexion...");
      const response = await login(username, password);
      console.log("Réponse de l'API:", response);

      if (response && response.token) {
        console.log("Token reçu, enregistrement...");
        // Enregistrement du token
        await AsyncStorage.setItem("token", response.token);
        console.log("Token enregistré!");

        // Informer l'utilisateur de la connexion réussie
        Alert.alert("Connexion réussie", "Vous êtes connecté avec succès !", [
          {
            text: "OK",
            onPress: () => {
              // Recharger l'application entièrement
              reloadApp();
            },
          },
        ]);
      } else {
        throw new Error("Token invalide ou manquant");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError(
        error.message ||
          "Erreur lors de la connexion. Vérifiez vos identifiants."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Si en cours de chargement, afficher le LoadingScreen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#1F3971" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Logo */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/sipwhite.png")}
          />
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenue à nouveau</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

          {/* Message d'erreur */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Champ username */}
          <View style={styles.inputContainer}>
            <Icon
              name="account-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* Champ mot de passe */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Lien mot de passe oublié */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton Connexion */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Chargement..." : "Se connecter"}
            </Text>
          </TouchableOpacity>

          {/* Lien vers l'inscription */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Vous n'avez pas de compte ?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.registerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: "#1F3971",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#1F3971",
    fontSize: 14,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#1F3971",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;
