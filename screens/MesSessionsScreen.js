import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SessionInscritService } from "../service/SessionInscritService";
import { formaterDate, formaterDateTime } from "../utils/dateFormater"; // Importer vos fonctions de formatage
import Ionicons from "react-native-vector-icons/Ionicons";
import { isAuthenticated } from "../service/AuthService"; // Importez la fonction d'authentification

const MesSessionsScreen = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);
    };

    checkAuthStatus();
  }, []);

  // Fonction pour charger les sessions
  const loadSessions = async () => {
    try {
      setError(null);

      // Vérifier si l'utilisateur est connecté avant de charger les sessions
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus);

      if (!authStatus) {
        setError("Veuillez vous connecter pour voir vos sessions");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const data = await SessionInscritService.getMesSessions();
      setSessions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error);

      if (error.message === "Utilisateur non connecté") {
        setError("Veuillez vous connecter pour voir vos sessions");
      } else {
        setError("Impossible de charger vos sessions");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Charger les sessions au montage du composant
  useEffect(() => {
    loadSessions();
  }, []);

  // Fonction pour rafraîchir les données
  const onRefresh = () => {
    setRefreshing(true);
    loadSessions();
  };

  // Rediriger vers la page de connexion
  const redirectToLogin = () => {
    navigation.navigate("Login", { returnTo: "MesSessions" });
  };

  // Fonction pour formater la date en utilisant le formatage personnalisé
  const formatDate = (dateString) => {
    if (!dateString) return "Date non disponible";

    try {
      // Extraire la date au format "DD-MM-YYYY HH:mm"
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("-");
      const date = new Date(`${year}-${month}-${day}T${timePart || "00:00"}`);

      // Utiliser votre fonction de formatage
      return formaterDateTime(date);
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return dateString;
    }
  };

  // Rendu de chaque élément de la liste
  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => navigation.navigate("SessionDetails", { session: item })}
    >
      <View style={styles.sessionContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.titre}>{item.titre}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="calendar-outline" size={16} color="#1f3971" />
          <Text style={styles.dateText}>
            <Text style={styles.label}>Début: </Text>
            {formatDate(item.dateDebut)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="calendar-outline" size={16} color="#1f3971" />
          <Text style={styles.dateText}>
            <Text style={styles.label}>Fin: </Text>
            {formatDate(item.dateFin)}
          </Text>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("SessionDetails", { session: item })
            }
          >
            <Text style={styles.detailsButtonText}>Voir les détails</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Afficher un message si l'utilisateur n'est pas connecté
  if (error === "Veuillez vous connecter pour voir vos sessions") {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="log-in-outline" size={60} color="#1f3971" />
        <Text style={styles.errorText}>
          Veuillez vous connecter pour accéder à vos sessions
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={redirectToLogin}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1f3971" />
        <Text style={styles.loadingText}>Chargement de vos sessions...</Text>
      </View>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSessions}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher un message si aucune session n'est trouvée
  if (sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar" size={60} color="#1f3971" />
        <Text style={styles.emptyText}>
          Vous n'êtes inscrit à aucune session
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate("Sessions")}
        >
          <Text style={styles.browseButtonText}>
            Parcourir les sessions disponibles
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher la liste des sessions
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Mes Sessions</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSessionItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1f3971"]}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f3971",
    marginBottom: 16,
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 80,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  sessionContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 12,
  },
  titre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f3971",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  dateText: {
    marginLeft: 6,
    color: "#555",
    fontSize: 14,
  },
  footerContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailsButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "#1f3971",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    color: "#1f3971",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    marginTop: 12,
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1f3971",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  emptyText: {
    marginTop: 12,
    color: "#555",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#1f3971",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#1f3971",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MesSessionsScreen;
