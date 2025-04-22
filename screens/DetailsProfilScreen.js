import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";

const DetailsProfilScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  // Récupérer l'URL de l'image de profil
  const getProfileImageUrl = () => {
    const baseUrl = "https://mobile.sip-academy.com/uploads/coach/";

    if (user && user.logo && user.logo !== "-") {
      return `${baseUrl}${user.logo}`;
    }

    return `${baseUrl}student-68077164d5a8c.jpg`;
  };

  // Ouvrir le CV si disponible
  const openCV = () => {
    if (user && user.cv && user.cv !== "-") {
      Linking.openURL(user.cv).catch(() => {
        console.error("Impossible d'ouvrir le CV");
      });
    } else {
      console.log("Aucun CV disponible");
    }
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
        <Text style={styles.headerTitle}>Détails du Profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: getProfileImageUrl(),
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{`${user.prenom} ${user.nom}`}</Text>
        </View>

        {/* Biographie Section */}
        <View style={styles.formContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Biographie</Text>
                <Ionicons name="book-outline" size={22} color="#1F3971" />
              </View>
              <Text style={styles.biographyText}>
                {user.Biographie && user.Biographie !== "-"
                  ? user.Biographie
                  : "Aucune biographie disponible."}
              </Text>
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
              {user.cv && user.cv !== "-" ? (
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
                value={user.tel1 !== "-" ? user.tel1 : "Non spécifié"}
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
                value={user.tel2 !== "-" ? user.tel2 : "Non spécifié"}
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
                value={user.adresse !== "-" ? user.adresse : "Non spécifiée"}
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
                value={user.linkedin !== "-" ? user.linkedin : "Non spécifié"}
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
                value={user.facebook !== "-" ? user.facebook : "Non spécifié"}
                editable={false}
              />
            </View>
          </View>
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
});

export default DetailsProfilScreen;
