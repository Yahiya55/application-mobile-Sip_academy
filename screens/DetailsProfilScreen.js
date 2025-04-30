import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import du service updateUserProfile
import { updateUserProfile } from "../service/UserService"; // Ajustez le chemin selon votre structure de projet

const DetailsProfilScreen = ({ route }) => {
  const { user: initialUser } = route.params;
  const [user, setUser] = useState(initialUser);
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    prenom: user.prenom || "",
    nom: user.nom || "",
    phone: user.tel1 !== "-" ? user.tel1 : "", // Sera envoyé comme phone1
    phone1: user.tel2 !== "-" ? user.tel2 : "", // Sera envoyé comme phone2
    Linkedin: user.linkedin !== "-" ? user.linkedin : "",
    Facebook: user.facebook !== "-" ? user.facebook : "",
    adresse: user.adresse !== "-" ? user.adresse : "",
    biographie: user.Biographie !== "-" ? user.Biographie : "",
    password: "",
    confirmPassword: "",
  });

  // État pour les fichiers (photo et CV)
  const [logoFile, setLogoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Initialiser l'image de prévisualisation lors du chargement
  useEffect(() => {
    setPreviewImage(getProfileImageUrl());
  }, [user]);

  // Récupérer l'URL de l'image de profil
  const getProfileImageUrl = () => {
    const baseUrl = "https://mobile.sip-academy.com/uploads/coach/";
    if (user && user.logo && user.logo !== "-") {
      return `${baseUrl}${user.logo}`;
    }
    return `${baseUrl}student-68077164d5a8c.jpg`;
  };

  // Gestion des changements de champs
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Sélection d'une nouvelle photo de profil
  const selectImage = async () => {
    if (!editMode) return;
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission requise",
          "Vous devez autoriser l'accès à la galerie."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setLogoFile(result.assets[0]);
        setPreviewImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  // Sélection d'un nouveau CV
  const selectCV = async () => {
    if (!editMode) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.canceled === false) {
        setCvFile(result.assets[0]);
        Alert.alert("Succès", "CV sélectionné avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du CV:", error);
      Alert.alert("Erreur", "Impossible de sélectionner le CV");
    }
  };

  // Ouvrir le CV existant
  const openCV = () => {
    if (user && user.cv && user.cv !== "-") {
      const cvUrl = `https://mobile.sip-academy.com/uploads/cv/${user.cv}`;
      Linking.openURL(cvUrl).catch(() => {
        Alert.alert("Erreur", "Impossible d'ouvrir le CV");
      });
    } else {
      Alert.alert("Information", "Aucun CV disponible");
    }
  };

  // Validation du formulaire avant l'envoi
  const validateForm = () => {
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      Alert.alert("Erreur", "Le nom et le prénom sont obligatoires");
      return false;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  // Envoyer les modifications au serveur en utilisant le service importé
  const saveChanges = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Erreur",
          "Vous devez être connecté pour modifier votre profil"
        );
        setLoading(false);
        return;
      }

      // Création du FormData pour l'envoi
      const data = new FormData();

      // Assurez-vous que tous les champs sont envoyés correctement
      data.append("prenom", formData.prenom.trim());
      data.append("nom", formData.nom.trim());
      data.append("phone1", formData.phone.trim() || "-");
      data.append("phone2", formData.phone1.trim() || "-");
      data.append("Linkedin", formData.Linkedin.trim() || "-");
      data.append("Facebook", formData.Facebook.trim() || "-");
      data.append("adresse", formData.adresse.trim() || "-");
      data.append("biographie", formData.biographie.trim() || "-");

      // Ajouter le mot de passe seulement s'il est défini
      if (formData.password && formData.password.trim() !== "") {
        data.append("password", formData.password.trim());
      }

      // Ajout de la photo de profil si modifiée
      if (logoFile) {
        // S'assurer que tous les champs nécessaires pour le fichier sont définis
        const fileInfo = {
          uri: logoFile.uri,
          type: logoFile.mimeType || "image/jpeg",
          name: logoFile.fileName || `photo_${Date.now()}.jpg`,
        };
        data.append("logo", fileInfo);
      }

      // Ajout du CV si modifié
      if (cvFile) {
        const fileInfo = {
          uri: cvFile.uri,
          type: cvFile.mimeType || "application/pdf",
          name: cvFile.name || `cv_${Date.now()}.pdf`,
        };
        data.append("cv", fileInfo);
      }

      // Debug: Affichage des données avant envoi
      console.log(
        "FormData à envoyer:",
        JSON.stringify(Array.from(data._parts))
      );

      try {
        const updatedUser = await updateUserProfile(user.id, data, token);

        // Mise à jour de l'utilisateur en local
        setUser(updatedUser.user || updatedUser);
        setEditMode(false);
        Alert.alert("Succès", "Votre profil a été mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
        throw error; // Relancer l'erreur pour la gestion globale
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      if (error.response) {
        console.error("Statut de la réponse:", error.response.status);
        console.error("Données de la réponse:", error.response.data);
      }
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  // Basculer entre mode lecture et mode édition
  const toggleEditMode = () => {
    if (editMode) {
      // Si on quitte le mode édition, on réinitialise les données
      setFormData({
        prenom: user.prenom || "",
        nom: user.nom || "",
        phone: user.tel1 !== "-" ? user.tel1 : "", // Sera envoyé comme phone1
        phone1: user.tel2 !== "-" ? user.tel2 : "", // Sera envoyé comme phone2
        Linkedin: user.linkedin !== "-" ? user.linkedin : "",
        Facebook: user.facebook !== "-" ? user.facebook : "",
        adresse: user.adresse !== "-" ? user.adresse : "",
        biographie: user.Biographie !== "-" ? user.Biographie : "",
        password: "",
        confirmPassword: "",
      });
      setLogoFile(null);
      setCvFile(null);
      setPreviewImage(getProfileImageUrl());
    }
    setEditMode(!editMode);
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
        <Text style={styles.headerTitle}>
          {editMode ? "Modifier mon Profil" : "Détails du Profil"}
        </Text>
        <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
          <Ionicons
            name={editMode ? "close" : "create-outline"}
            size={24}
            color="#1F3971"
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={selectImage} disabled={!editMode}>
            <Image source={{ uri: previewImage }} style={styles.profileImage} />
            {editMode && (
              <View style={styles.editImageBtn}>
                <Ionicons name="camera" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>
            {editMode
              ? `${formData.prenom} ${formData.nom}`
              : `${user.prenom} ${user.nom}`}
          </Text>
        </View>
        <View style={styles.formContainer}>
          {/* Biographie Section */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Biographie</Text>
                <Ionicons name="book-outline" size={22} color="#1F3971" />
              </View>
              {editMode ? (
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={5}
                  placeholder="Entrez votre biographie..."
                  value={formData.biographie}
                  onChangeText={(text) => handleInputChange("biographie", text)}
                />
              ) : (
                <Text style={styles.biographyText}>
                  {user.Biographie && user.Biographie !== "-"
                    ? user.Biographie
                    : "Aucune biographie disponible."}
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* CV Section */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>CV</Text>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#1F3971"
                />
              </View>
              {editMode ? (
                <TouchableOpacity style={styles.cvButton} onPress={selectCV}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#fff"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.cvButtonText}>
                    {cvFile ? "CV sélectionné" : "Sélectionner un CV"}
                  </Text>
                </TouchableOpacity>
              ) : user.cv && user.cv !== "-" ? (
                <TouchableOpacity style={styles.cvButton} onPress={openCV}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color="#fff"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.cvButtonText}>Voir mon CV</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.emptyText}>Aucun CV disponible.</Text>
              )}
            </Card.Content>
          </Card>

          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {editMode ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prénom</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="person"
                    size={20}
                    color="#1F3971"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.prenom}
                    onChangeText={(text) => handleInputChange("prenom", text)}
                    placeholder="Votre prénom"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="person"
                    size={20}
                    color="#1F3971"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.nom}
                    onChangeText={(text) => handleInputChange("nom", text)}
                    placeholder="Votre nom"
                  />
                </View>
              </View>
            </>
          ) : (
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
          )}

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
                style={[styles.input, { color: "#999" }]}
                value={user.email}
                editable={false}
              />
            </View>
          </View>

          {editMode && (
            <>
              <Text style={styles.sectionTitle}>Mot de passe</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="lock-closed"
                    size={20}
                    color="#1F3971"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    placeholder="Laisser vide pour ne pas changer"
                    secureTextEntry
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#1F3971"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      handleInputChange("confirmPassword", text)
                    }
                    placeholder="Confirmer le nouveau mot de passe"
                    secureTextEntry
                  />
                </View>
              </View>
            </>
          )}

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
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.phone} // Sera envoyé comme phone1
                  onChangeText={(text) => handleInputChange("phone", text)}
                  placeholder="Votre téléphone principal"
                  keyboardType="phone-pad"
                />
              ) : (
                <TextInput
                  style={styles.input}
                  value={user.tel1 !== "-" ? user.tel1 : "Non spécifié"}
                  editable={false}
                />
              )}
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
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.phone1} // Sera envoyé comme phone2
                  onChangeText={(text) => handleInputChange("phone1", text)}
                  placeholder="Votre téléphone secondaire"
                  keyboardType="phone-pad"
                />
              ) : (
                <TextInput
                  style={styles.input}
                  value={user.tel2 !== "-" ? user.tel2 : "Non spécifié"}
                  editable={false}
                />
              )}
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
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.adresse}
                  onChangeText={(text) => handleInputChange("adresse", text)}
                  placeholder="Votre adresse"
                  multiline={true}
                />
              ) : (
                <TextInput
                  style={styles.input}
                  value={user.adresse !== "-" ? user.adresse : "Non spécifiée"}
                  editable={false}
                  multiline={true}
                />
              )}
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
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.Linkedin}
                  onChangeText={(text) => handleInputChange("Linkedin", text)}
                  placeholder="Votre profil LinkedIn"
                />
              ) : (
                <TextInput
                  style={styles.input}
                  value={user.linkedin !== "-" ? user.linkedin : "Non spécifié"}
                  editable={false}
                />
              )}
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
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.Facebook}
                  onChangeText={(text) => handleInputChange("Facebook", text)}
                  placeholder="Votre profil Facebook"
                />
              ) : (
                <TextInput
                  style={styles.input}
                  value={user.facebook !== "-" ? user.facebook : "Non spécifié"}
                  editable={false}
                />
              )}
            </View>
          </View>

          {editMode && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="save-outline"
                    size={20}
                    color="#fff"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.saveButtonText}>
                    Enregistrer les modifications
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  editButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F3971",
  },
  profileImageContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#1F3971",
    marginBottom: 15,
  },
  editImageBtn: {
    position: "absolute",
    right: 0,
    bottom: 15,
    backgroundColor: "#1F3971",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F3971",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    marginVertical: 15,
    elevation: 2,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  biographyText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1F3971",
  },
  cvButton: {
    flexDirection: "row",
    backgroundColor: "#1F3971",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  cvButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  btnIcon: {
    marginRight: 8,
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
  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 10,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#1F3971",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DetailsProfilScreen;
