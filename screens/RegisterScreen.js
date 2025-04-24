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
import { register } from "../service/AuthService";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    // Validation des champs
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !nom ||
      !prenom ||
      !adresse ||
      !phone
    ) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setIsLoading(true);
    setError("");
    // Création de l'objet utilisateur pour l'inscription
    const newUser = {
      email,
      password,
      confirmPassword,
      nom,
      prenom,
      adresse,
      phone,
      options: role,
    };
    // Appel au service d'enregistrement
    const result = await register(newUser);
    setIsLoading(false);
    // Vérification du résultat de l'inscription
    if (result.success) {
      Alert.alert("Succès", result.message);
      navigation.navigate("Login");
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1F3971" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Bouton Retour */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("WelcomeScreen")}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Logo SIPACADEMY */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/sipwhite.png")}
          />
        </View>

        {/* Formulaire d'inscription */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>SIPACADEMY</Text>
          <Text style={styles.subtitle}>Créez votre compte</Text>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Champ Nom */}
          <View style={styles.inputContainer}>
            <Icon
              name="account-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={nom}
              onChangeText={setNom}
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Prénom */}
          <View style={styles.inputContainer}>
            <Icon
              name="account-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={prenom}
              onChangeText={setPrenom}
              placeholderTextColor="#999"
            />
          </View>

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
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Téléphone */}
          <View style={styles.inputContainer}>
            <Icon
              name="phone-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Adresse */}
          <View style={styles.inputContainer}>
            <Icon
              name="map-marker-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={adresse}
              onChangeText={setAdresse}
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Rôle */}
          <View style={styles.inputContainer}>
            <Icon
              name="shield-account-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Rôle (user/admin)"
              value={role}
              onChangeText={setRole}
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Mot de passe */}
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

          {/* Champ Confirmer le mot de passe */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock-outline"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Icon
                name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Bouton d'inscription */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Loading..." : "REGISTER"}
            </Text>
          </TouchableOpacity>

          {/* Politique de confidentialité */}
          <Text style={styles.policyText}>
            En acceptant, vous acceptez nos conditions d'utilisation et notre
            politique de confidentialité.
          </Text>

          {/* Lien vers la page de connexion */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
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
  registerButton: {
    backgroundColor: "#1F3971",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  policyText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
});

export default RegisterScreen;
