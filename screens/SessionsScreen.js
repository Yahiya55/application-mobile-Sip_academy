import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HTML from "react-native-render-html";
import { getSessions } from "../service/SessionService";
import {
  getInscritSessions,
  getInscritSessionsNoId,
  fetchUserSessionsWithProfileAPI,
  getMesSessions,
} from "../service/InscriSessionService";
import { getClasseVirtuelleDetails } from "../service/ClasseVirtuelleService";
import {
  isAuthenticated,
  getCurrentUser,
  fetchUserProfileFromAPI,
} from "../service/AuthService";
import { API_BASE_URL2, API_BASE_URL3, IMAGE_BASE_URL2 } from "@env";
import { formaterDate, formaterDateTime } from "../utils/dateFormater";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SessionsScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const [inscritSessions, setInscritSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Prochaines");
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Nouveaux states pour la gestion des classes virtuelles
  const [selectedClassesVirtuelles, setSelectedClassesVirtuelles] = useState(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSessionTitle, setSelectedSessionTitle] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      // Vérifier si l'utilisateur est authentifié
      const authenticated = await isAuthenticated();
      setIsUserAuthenticated(authenticated);

      // Récupérer toutes les sessions disponibles
      console.log("Début de la récupération des sessions...");
      const sessionData = await getSessions();
      setSessions(sessionData["hydra:member"] || []);

      // Si l'utilisateur est connecté, récupérer ses sessions inscrites
      if (authenticated) {
        console.log(
          "Utilisateur authentifié - récupération des sessions inscrites"
        );

        try {
          // Utiliser notre nouvelle méthode directe pour récupérer les sessions inscrites
          const mesSessionsData = await getMesSessions();
          console.log(
            "Sessions inscrites récupérées avec succès via API directe"
          );
          setInscritSessions(
            Array.isArray(mesSessionsData) ? mesSessionsData : []
          );
        } catch (userError) {
          console.error(
            "Erreur lors de la récupération des sessions inscrites avec API directe:",
            userError
          );

          // En cas d'échec, essayer les méthodes alternatives
          try {
            let userSessions = [];

            // Stratégie 1: Utiliser l'ID utilisateur disponible
            const user = await getCurrentUser();

            if (user && user.id) {
              console.log(`Tentative avec ID utilisateur: ${user.id}`);
              setUserId(user.id);
              userSessions = await getInscritSessions(user.id);
            }
            // Stratégie 2: Récupérer le profil utilisateur d'abord
            else {
              console.log("Tentative via l'API de profil");
              userSessions = await fetchUserSessionsWithProfileAPI();
            }

            // Si aucune session n'est trouvée avec les méthodes précédentes
            if (!userSessions || userSessions.length === 0) {
              console.log("Tentative directe avec token");
              const token = await AsyncStorage.getItem("token");
              if (token) {
                userSessions = await getInscritSessionsNoId(token);
              }
            }

            console.log(
              `Sessions inscrites récupérées: ${userSessions.length}`
            );
            setInscritSessions(Array.isArray(userSessions) ? userSessions : []);
          } catch (fallbackError) {
            console.error(
              "Erreur lors des tentatives alternatives:",
              fallbackError
            );
            Alert.alert(
              "Erreur",
              "Impossible de récupérer vos sessions inscrites. Veuillez réessayer."
            );
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Fonction pour ouvrir la modal avec les classes virtuelles
  const showClassesVirtuelles = (classesvirtuels, sessionTitle) => {
    setSelectedClassesVirtuelles(classesvirtuels);
    setSelectedSessionTitle(sessionTitle);
    setModalVisible(true);
  };

  // Fonction pour ouvrir un lien (Meet, Drive, Github)
  const openLink = async (url) => {
    if (!url) return;

    // Nettoyer l'URL en supprimant les espaces potentiels
    const cleanUrl = url.trim();

    const canOpen = await Linking.canOpenURL(cleanUrl);
    if (canOpen) {
      await Linking.openURL(cleanUrl);
    } else {
      Alert.alert("Erreur", "Impossible d'ouvrir ce lien");
    }
  };

  // Extraire les infos de la description HTML
  const extractInfoFromDescription = (description) => {
    if (!description) return { title: "", date: "", time: "" };

    // Supprimer les balises HTML
    const stripHtml = description.replace(/<[^>]*>?/gm, "");

    // Extraire le titre (avant la première nouvelle ligne)
    const lines = stripHtml.split("\r\n");
    const title = lines[0] || "";

    // Chercher la date et l'heure dans le texte
    const dateMatch = stripHtml.match(/(\d{1,2}\s\w+),\s+(\d{1,2}\s\w+)/);
    const timeMatch = stripHtml.match(/(\d{1,2}:\d{2})\s+à\s+(\d{1,2}:\d{2})/);

    return {
      title: title.trim(),
      date: dateMatch ? dateMatch[2] : "",
      time: timeMatch ? `${timeMatch[1]} - ${timeMatch[2]}` : "",
    };
  };

  // Fonction pour extraire le jour/séance de la description
  const extractSessionDay = (description) => {
    if (!description) return "";

    const dayMatch = description.match(/\[(.*?)\]/);
    return dayMatch ? dayMatch[1] : "";
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (date, heureDebut, heureFin) => {
    if (!date) return "";
    return `${date} • ${heureDebut || ""} ${heureFin ? "- " + heureFin : ""}`;
  };

  // Fonction pour rendre une classe virtuelle dans la modal
  const renderClasseVirtuelle = (item, index) => {
    // Extraire les informations de la classe virtuelle
    const sessionDay = extractSessionDay(item.description);
    const dateTime = formatDateTime(item.date, item.heuredebut, item.heurefin);

    return (
      <View key={item.id.toString()} style={styles.classeVirtuelleItem}>
        <Text style={styles.classeVirtuelleTitle}>
          {sessionDay || item.titre || `Séance ${index + 1}`}
        </Text>
        <Text style={styles.classeVirtuelleDate}>{dateTime}</Text>

        <View style={styles.linkButtons}>
          {item.lienMeet && (
            <TouchableOpacity
              style={[styles.linkButton, styles.meetButton]}
              onPress={() => openLink(item.lienMeet)}
            >
              <Ionicons name="videocam" size={16} color="#fff" />
              <Text style={styles.linkButtonText}>Meet</Text>
            </TouchableOpacity>
          )}

          {item.lienDrive && (
            <TouchableOpacity
              style={[styles.linkButton, styles.driveButton]}
              onPress={() => openLink(item.lienDrive)}
            >
              <Ionicons name="folder" size={16} color="#fff" />
              <Text style={styles.linkButtonText}>Drive</Text>
            </TouchableOpacity>
          )}

          {item.lienGithub && (
            <TouchableOpacity
              style={[styles.linkButton, styles.githubButton]}
              onPress={() => openLink(item.lienGithub)}
            >
              <Ionicons name="logo-github" size={16} color="#fff" />
              <Text style={styles.linkButtonText}>GitHub</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bouton pour accéder aux détails */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            setModalVisible(false); // Fermer la modal
            navigation.navigate("ClasseVirtuelleDetails", {
              classeVirtuelleId: item.id,
              sessionTitre: selectedSessionTitle,
            });
          }}
        >
          <Text style={styles.detailsButtonText}>Détails</Text>
        </TouchableOpacity>

        {index < selectedClassesVirtuelles.length - 1 && (
          <View style={styles.divider} />
        )}
      </View>
    );
  };

  const today = new Date().toISOString().split("T")[0];

  // Filtrer puis trier les sessions par date décroissante (plus récente en premier)
  const upcomingSessions = sessions
    .filter(
      (session) => session.starttime && session.starttime.split("T")[0] > today
    )
    .sort((a, b) => new Date(a.starttime) - new Date(b.starttime)); // Date croissante pour prochaines sessions

  const pastSessions = sessions
    .filter(
      (session) => session.starttime && session.starttime.split("T")[0] <= today
    )
    .sort((a, b) => new Date(b.starttime) - new Date(a.starttime)); // Date décroissante pour sessions passées

  // Selon la catégorie sélectionnée, on affiche les sessions correspondantes
  let filteredSessions = [];
  switch (selectedCategory) {
    case "Prochaines":
      filteredSessions = upcomingSessions;
      break;
    case "Anciennes":
      filteredSessions = pastSessions;
      break;
    case "Mes sessions":
      filteredSessions = inscritSessions;
      break;
    default:
      filteredSessions = upcomingSessions;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#203a72" />
        <Text>Chargement des sessions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fonction pour rendre une session selon son format
  const renderSession = ({ item }) => {
    // Vérifier si la session est au format standard ou au format des sessions inscrites
    const isInscritFormat = item.dateDebut && item.dateFin && !item.starttime;

    // Adapter les champs selon le format
    const title = isInscritFormat ? item.titre : item.titre;
    const imageUrl = isInscritFormat
      ? `${IMAGE_BASE_URL2}/${item.image}`
      : `${IMAGE_BASE_URL2}/${item.image}`;
    const startDate = isInscritFormat
      ? item.dateDebut
      : formaterDateTime(item.starttime);
    const endDate = isInscritFormat
      ? item.dateFin
      : formaterDateTime(item.endtime);
    const location = item.adresse || "Classe virtuelle";
    const description = item.descriptionshort || "";

    // Compter les classes virtuelles si disponibles
    const classesVirtuellesCount =
      isInscritFormat && item.classesvirtuels ? item.classesvirtuels.length : 0;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SessionDetails", { session: item })}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            defaultSource={require("../assets/logoSip.png")}
          />
          <View style={styles.details}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDate}>
              {startDate} - {endDate}
            </Text>
            <Text style={styles.cardMode}>{location}</Text>

            {/* Description courte si disponible */}
            {description && (
              <HTML
                source={{ html: description }}
                contentWidth={Dimensions.get("window").width - 40}
                tagsStyles={{
                  p: { fontSize: 12, color: "#555", marginVertical: 4 },
                }}
              />
            )}

            {/* Afficher les classes virtuelles pour les sessions inscrites */}
            {classesVirtuellesCount > 0 && (
              <TouchableOpacity
                style={styles.classesVirtuellesContainer}
                onPress={() =>
                  showClassesVirtuelles(item.classesvirtuels, title)
                }
              >
                <View style={styles.classesVirtuellesHeader}>
                  <Text style={styles.classesVirtuellesTitle}>
                    Classes virtuelles ({classesVirtuellesCount})
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#203a72" />
                </View>
              </TouchableOpacity>
            )}

            {/* Bouton Détails */}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate("SessionDetails", { session: item })
              }
            >
              <Text style={styles.detailsButtonText}>Détails</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Fixe */}
      <View style={styles.fixedHeader}>
        <Image
          source={{
            uri: "https://sip-academy.com/uploads/icon/SIPFront-6437228815aa3.png",
          }}
          style={styles.logo}
        />
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Titre "Sessions" */}
      <View style={styles.titleContainer}>
        <Ionicons name="calendar-outline" size={24} color="#203a72" />
        <Text style={styles.mainTitle}>Sessions</Text>
      </View>

      {/* Catégories des sessions */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "Prochaines" && styles.activeCategory,
          ]}
          onPress={() => setSelectedCategory("Prochaines")}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "Prochaines" && styles.activeCategoryText,
            ]}
          >
            Prochaines
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "Anciennes" && styles.activeCategory,
          ]}
          onPress={() => setSelectedCategory("Anciennes")}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "Anciennes" && styles.activeCategoryText,
            ]}
          >
            Anciennes
          </Text>
        </TouchableOpacity>

        {isUserAuthenticated && (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === "Mes sessions" && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory("Mes sessions")}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "Mes sessions" &&
                  styles.activeCategoryText,
              ]}
            >
              Mes sessions
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Message si aucune session */}
      {filteredSessions.length === 0 && (
        <View style={styles.emptySessionsContainer}>
          <Text style={styles.emptySessionsText}>
            {selectedCategory === "Mes sessions"
              ? "Vous n'êtes inscrit à aucune session pour le moment."
              : selectedCategory === "Prochaines"
              ? "Aucune session à venir pour le moment."
              : "Aucune session passée à afficher."}
          </Text>

          {selectedCategory === "Mes sessions" && !isUserAuthenticated && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Liste des sessions filtrées */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSession}
        contentContainerStyle={[
          styles.listContainer,
          filteredSessions.length === 0 && styles.emptyListContainer,
        ]}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal pour afficher les classes virtuelles */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSessionTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#203a72" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Classes virtuelles ({selectedClassesVirtuelles.length})
            </Text>

            <ScrollView style={styles.classesList}>
              {selectedClassesVirtuelles.map((item, index) =>
                renderClasseVirtuelle(item, index)
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 60, // Pour éviter que la liste soit cachée par la navigation du bas
  },

  fixedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  logo: { width: 120, height: 35, resizeMode: "contain" },

  titleContainer: {
    flexDirection: "row",
    padding: 5,
    marginTop: 50,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#203a72",
    marginLeft: 8,
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeCategory: {
    backgroundColor: "#203a72",
  },
  categoryText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "bold",
  },
  activeCategoryText: {
    color: "#fff",
  },

  /* Liste des sessions */
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  image: {
    objectFit: "cover",
    width: "100%",
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  details: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#203a72" },
  cardDate: { fontSize: 12, color: "#757575", marginTop: 5 },
  cardMode: {
    fontSize: 12,
    color: "#424242",
    fontWeight: "bold",
    marginTop: 3,
  },

  /* Classes virtuelles container */
  classesVirtuellesContainer: {
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  classesVirtuellesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classesVirtuellesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#203a72",
  },

  /* Modal pour les classes virtuelles */
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#203a72",
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  classesList: {
    maxHeight: 400,
  },
  classeVirtuelleItem: {
    marginBottom: 10,
    padding: 5,
  },
  classeVirtuelleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#203a72",
    marginBottom: 5,
  },
  classeVirtuelleDate: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  linkButtons: {
    flexDirection: "row",
    marginVertical: 10,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
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
    fontSize: 12,
    marginLeft: 5,
  },
  descriptionContainer: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  closeButton: {
    backgroundColor: "#203a72",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  /* Loading et erreur */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
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

  /* Message vide */
  emptySessionsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptySessionsText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#203a72",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  /* Bouton Détails */
  detailsButton: {
    marginTop: 12,
    backgroundColor: "#203a72",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  /* Modifier le style du bouton détails pour les classes virtuelles */
  classeVirtuelleDetailsButton: {
    backgroundColor: "#203a72",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  classeVirtuelleDetailsButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SessionsScreen;
