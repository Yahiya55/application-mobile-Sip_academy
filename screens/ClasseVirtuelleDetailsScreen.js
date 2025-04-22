import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HTML from "react-native-render-html";
import { Dimensions } from "react-native";
import { getClasseVirtuelleDetails } from "../service/ClasseVirtuelleService";

const ClasseVirtuelleDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { classeVirtuelleId, sessionTitre } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classeVirtuelle, setClasseVirtuelle] = useState(null);

  // Fonction pour charger les détails de la classe virtuelle
  const fetchClasseVirtuelleDetails = async () => {
    try {
      setLoading(true);
      console.log("Chargement des détails pour l'ID:", classeVirtuelleId);
      const data = await getClasseVirtuelleDetails(classeVirtuelleId);
      console.log("Données reçues de l'API:", data);

      // Vérifiez si les données sont un tableau et prenez le premier élément
      if (Array.isArray(data) && data.length > 0) {
        console.log(
          "Données reçues sous forme de tableau, utilisation du premier élément"
        );
        setClasseVirtuelle(data[0]);
      } else {
        setClasseVirtuelle(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
      setError("Impossible de charger les détails de la classe virtuelle");
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails lors du premier rendu
  useEffect(() => {
    fetchClasseVirtuelleDetails();
  }, [classeVirtuelleId]);

  // Debug: Surveiller les changements dans classeVirtuelle
  useEffect(() => {
    console.log("État classeVirtuelle mis à jour:", classeVirtuelle);
  }, [classeVirtuelle]);

  // Fonction pour ouvrir un lien externe
  const openLink = async (url) => {
    if (!url) {
      Alert.alert("Erreur", "Le lien n'est pas disponible");
      return;
    }

    const cleanUrl = url.trim();

    try {
      const canOpen = await Linking.canOpenURL(cleanUrl);
      if (canOpen) {
        await Linking.openURL(cleanUrl);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de l'ouverture du lien"
      );
    }
  };

  // Formatage de l'heure pour l'affichage
  const formatTime = (heureDebut, heureFin) => {
    if (!heureDebut && !heureFin) return "";
    return `${heureDebut || ""} ${heureFin ? `- ${heureFin}` : ""}`;
  };

  // Formatage de la date pour gérer le cas '00:00'
  const formatDate = (date) => {
    if (!date || date === "00:00") return "Date non spécifiée";
    return date;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#203a72" />
        <Text>Chargement des détails...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchClasseVirtuelleDetails}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#203a72" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la classe</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Info session parent */}
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionTitle}>{sessionTitre}</Text>
        </View>

        {/* Détails de la classe virtuelle */}
        <View style={styles.detailsContainer}>
          <Text style={styles.classeTitle}>
            {classeVirtuelle?.titre || "Classe virtuelle"}
          </Text>

          {/* Date et heure */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <Text style={styles.infoText}>
              {formatDate(classeVirtuelle?.date)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#555" />
            <Text style={styles.infoText}>
              {formatTime(
                classeVirtuelle?.heureDebut,
                classeVirtuelle?.heureFin
              ) || "Horaire non spécifié"}
            </Text>
          </View>

          {/* Liens externes */}
          <View style={styles.linksContainer}>
            {classeVirtuelle?.lienMeet && (
              <TouchableOpacity
                style={[styles.linkButton, styles.meetButton]}
                onPress={() => openLink(classeVirtuelle.lienMeet)}
              >
                <Ionicons name="videocam" size={20} color="#fff" />
                <Text style={styles.linkButtonText}>Google Meet</Text>
              </TouchableOpacity>
            )}

            {classeVirtuelle?.lienDrive && (
              <TouchableOpacity
                style={[styles.linkButton, styles.driveButton]}
                onPress={() => openLink(classeVirtuelle.lienDrive)}
              >
                <Ionicons name="folder" size={20} color="#fff" />
                <Text style={styles.linkButtonText}>Google Drive</Text>
              </TouchableOpacity>
            )}

            {classeVirtuelle?.lienGithub && (
              <TouchableOpacity
                style={[styles.linkButton, styles.githubButton]}
                onPress={() => openLink(classeVirtuelle.lienGithub)}
              >
                <Ionicons name="logo-github" size={20} color="#fff" />
                <Text style={styles.linkButtonText}>GitHub</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            {classeVirtuelle?.description ? (
              <View style={styles.descriptionContent}>
                <HTML
                  source={{
                    html: classeVirtuelle.description.replace(/\r\n/g, "<br>"),
                  }}
                  contentWidth={Dimensions.get("window").width - 40}
                  tagsStyles={{
                    p: { fontSize: 14, color: "#333", lineHeight: 20 },
                    h1: { fontSize: 22, fontWeight: "bold", color: "#203a72" },
                    h2: { fontSize: 20, fontWeight: "bold", color: "#203a72" },
                    li: { fontSize: 14, color: "#333", marginBottom: 5 },
                    a: { color: "#0066cc", textDecorationLine: "underline" },
                  }}
                />
              </View>
            ) : (
              <Text style={styles.noDescriptionText}>
                Aucune description disponible pour cette classe virtuelle.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#203a72",
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
  },
  sessionContainer: {
    backgroundColor: "#f0f5ff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#203a72",
  },
  detailsContainer: {
    padding: 15,
  },
  classeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 10,
  },
  linksContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  meetButton: {
    backgroundColor: "#c53929", // Rouge pour Google Meet
  },
  driveButton: {
    backgroundColor: "#0f9d58", // Vert pour Google Drive
  },
  githubButton: {
    backgroundColor: "#24292e", // Noir pour GitHub
  },
  linkButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 10,
  },
  descriptionSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#203a72",
    marginBottom: 10,
  },
  descriptionContent: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
  },
  noDescriptionText: {
    fontSize: 14,
    color: "#757575",
    fontStyle: "italic",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#203a72",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ClasseVirtuelleDetailsScreen;
