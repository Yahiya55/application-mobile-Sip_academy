import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { IMAGE_BASE_URL } from "@env";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ActualiteService } from "../service/actualiteservice";
import { formaterDate } from "../utils/dateFormater";

const ActualitesScreen = () => {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const data = await ActualiteService.getActualites();
        console.log(IMAGE_BASE_URL);
        setActualites(data["hydra:member"] || []);
      } catch (err) {
        setError("Erreur lors de la récupération des actualités.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#203a72" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
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

      {/* Titre Actualités */}
      <View style={styles.titleContainer}>
        <Ionicons name="newspaper-outline" size={24} color="#203a72" />
        <Text style={styles.mainTitle}>Actualités</Text>
      </View>

      {/* Liste des actualités */}
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {actualites.map((item) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ActualiteDetails", { actualite: item })
            }
            key={item.id}
            style={styles.card}
          >
            <Image
              source={{ uri: `${IMAGE_BASE_URL}/${item.image}` }}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={styles.cardTitle}>{item.titre}</Text>
              <Text style={styles.cardDate}>{formaterDate(item.date)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },

  /* Header fixe */
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

  /* Titre Actualités */
  titleContainer: {
    flexDirection: "row",
    padding: 10,
    marginTop: 50,
    marginBottom: 5,
    backgroundColor: "#f8f8f8",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#203a72",
    marginLeft: 8,
  },

  /* Liste des actualités */
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 10,
  },
  image: {objectFit:"fill", width: "100%", height: 160, borderRadius: 10 },
  details: { padding: 10, backgroundColor: "#e5ecfd", borderRadius: 10 },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#203a72" },
  cardDate: { fontSize: 12, color: "#757575", marginTop: 5 },
});

export default ActualitesScreen;
