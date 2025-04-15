import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { contactService } from "../service/ContactService";

const ContactScreen = () => {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isRobot, setIsRobot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = "Le message est requis";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!isRobot) {
      setErrors({
        ...errors,
        robot: "Veuillez confirmer que vous n'êtes pas un robot",
      });
      return;
    }

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    const messageData = {
      message,
      email,
      phone,
      nom: name,
      datemessage: new Date().toISOString(),
      reponse: "",
      datereponse: null,
      objetreponse: "",
      isRep: false,
    };

    try {
      const response = await contactService(messageData);
      Alert.alert("Succès", "Votre message a été envoyé avec succès !");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setIsRobot(false);
      setErrors({});
      setShowMessageForm(false);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'envoi du message."
      );
      console.log("Erreur d'envoi :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    {
      icon: "facebook",
      url: "https://www.facebook.com/smartitpartneracademy",
      color: "#1877F2",
    },
    {
      icon: "linkedin",
      url: "https://www.linkedin.com/in/mohamed-amine-mezghich/",
      color: "#0A66C2",
    },
    {
      icon: "github",
      url: "https://github.com/MezghichGit",
      color: "#333",
    },
    {
      icon: "youtube",
      url: "https://www.youtube.com/@SipAcademyTN",
      color: "#FF0000",
    },
  ];

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1F3971" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Logo et titre */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/sipwhite.png")}
          />
          <Text style={styles.headerTitle}>Contactez-nous</Text>
        </View>

        {/* Formulaire de contact dans un conteneur blanc arrondi */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Nous contacter</Text>
          <Text style={styles.subtitle}>
            SIP Academy est une école de formation en informatique avec
            plusieurs parcours et disciplines. Les formateurs collaborateurs de
            SIP Academy sont des experts du domaine avec plus de 15 ans
            d'expériences.
          </Text>

          {/* Informations de contact */}
          <View style={styles.contactInfoContainer}>
            <View style={styles.infoItem}>
              <Icon name="map-marker" size={24} color="#1F3971" />
              <Text style={styles.infoText}>
                Université SESAME, ZI Chotrana I BP4{"\n"}
                Parc Technologique El Ghazela, Ariana, Tunisia
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="phone" size={24} color="#1F3971" />
              <Text style={styles.infoText}>+216 98 787 521</Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="whatsapp" size={24} color="#1F3971" />
              <Text style={styles.infoText}>+216 51 363 634</Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="email" size={24} color="#1F3971" />
              <Text style={styles.infoText}>contact@sip-academy.com</Text>
            </View>
          </View>

          {/* Boutons réseaux sociaux */}
          <View style={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.socialButton, { backgroundColor: link.color }]}
                onPress={() => openLink(link.url)}
              >
                <Icon name={link.icon} size={24} color="#FFF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Bouton pour afficher/masquer le formulaire */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowMessageForm(!showMessageForm)}
          >
            <Text style={styles.toggleButtonText}>
              {showMessageForm ? "Masquer le formulaire" : "Envoyer un message"}
            </Text>
          </TouchableOpacity>

          {/* Formulaire de message */}
          {showMessageForm && (
            <View style={styles.messageFormContainer}>
              {/* Affichage des erreurs globales s'il y en a */}
              {Object.keys(errors).length > 0 && errors.global && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.global}</Text>
                </View>
              )}

              {/* Champ Nom */}
              <View
                style={[
                  styles.inputContainer,
                  errors.name ? styles.inputError : null,
                ]}
              >
                <Icon
                  name="account-outline"
                  size={24}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nom & Prénom*"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              {/* Champ Email */}
              <View
                style={[
                  styles.inputContainer,
                  errors.email ? styles.inputError : null,
                ]}
              >
                <Icon
                  name="email-outline"
                  size={24}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email*"
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

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
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Téléphone"
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Champ Message */}
              <View
                style={[
                  styles.inputContainer,
                  styles.messageInput,
                  errors.message ? styles.inputError : null,
                ]}
              >
                <Icon
                  name="message-text-outline"
                  size={24}
                  color="#999"
                  style={[
                    styles.icon,
                    { alignSelf: "flex-start", marginTop: 12 },
                  ]}
                />
                <TextInput
                  style={[styles.input, { textAlignVertical: "top" }]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Saisissez ici votre message.."
                  multiline
                  numberOfLines={5}
                  placeholderTextColor="#999"
                />
              </View>
              {errors.message && (
                <Text style={styles.errorText}>{errors.message}</Text>
              )}

              {/* Case "Je ne suis pas un robot" */}
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  errors.robot ? styles.inputError : null,
                ]}
                onPress={() => setIsRobot(!isRobot)}
              >
                <Icon
                  name={isRobot ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={24}
                  color={isRobot ? "#1F3971" : "#999"}
                />
                <Text style={styles.checkboxLabel}>
                  Je ne suis pas un robot
                </Text>
              </TouchableOpacity>
              {errors.robot && (
                <Text style={styles.errorText}>{errors.robot}</Text>
              )}

              {/* Bouton Envoyer */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Envoi en cours..." : "ENVOYER"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    paddingVertical: 30,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
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
    lineHeight: 24,
  },
  contactInfoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    color: "#333",
    fontSize: 16,
    flex: 1,
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "#1F3971",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageFormContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  messageInput: {
    height: 120,
    alignItems: "flex-start",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#1F3971",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
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
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 15,
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
});

export default ContactScreen;
