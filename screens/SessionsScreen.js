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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HTML from "react-native-render-html";
import { getSessions } from "../service/SessionService";
import { IMAGE_BASE_URL2 } from "@env";
import { formaterDate, formaterDateTime } from "../utils/dateFormater";

const SessionsScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Prochaines");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log("Début de la récupération des sessions...");
        const data = await getSessions();
        setSessions(data["hydra:member"] || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des sessions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const upcomingSessions = sessions.filter(
    (session) => session.starttime.split("T")[0] > today
  );

  const pastSessions = sessions.filter(
    (session) => session.starttime.split("T")[0] <= today
  );

  const filteredSessions =
    selectedCategory === "Prochaines" ? upcomingSessions : pastSessions;

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
      </View>
    );
  }

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
      </View>

      {/* Liste des sessions filtrées */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SessionDetails", { session: item })
            }
          >
            <View style={styles.card}>
              <Image
                source={{ uri: `${IMAGE_BASE_URL2}/${item.image}` }}
                style={styles.image}
              />
              <View style={styles.details}>
                <Text style={styles.cardTitle}>{item.titre}</Text>
                <Text style={styles.cardDate}>
                  {formaterDateTime(item.starttime)} -{" "}
                  {formaterDateTime(item.endtime)}
                </Text>
                <Text style={styles.cardMode}>{item.adresse}</Text>
                {/* Description courte */}
                <HTML
                  source={{ html: item.descriptionshort }}
                  contentWidth={Dimensions.get("window").width - 40}
                />
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
        )}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
  },
  logo: { width: 120, height: 35, resizeMode: "contain" },

  titleContainer: {
    flexDirection: "row",
    padding: 5,
    marginTop: 50,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
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
    marginBottom: 10,
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
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    padding: 10,
  },
  image: {
    objectFit:"fill",
    width: "100%",
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  details: { padding: 8 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#203a72" },
  cardDate: { fontSize: 12, color: "#757575", marginTop: 3 },
  cardMode: {
    fontSize: 12,
    color: "#424242",
    fontWeight: "bold",
    marginTop: 3,
  },

  /* Loading et erreur */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },

  /* Bouton Détails */
  detailsButton: {
    marginTop: 10,
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
});

export default SessionsScreen;
