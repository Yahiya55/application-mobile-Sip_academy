import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FormationsService } from "../service/FormationService";
import { IMAGE_BASE_URL1 } from "@env";
import HTML from "react-native-render-html";

const FormationDetailsScreen = () => {
  const route = useRoute();
  const { formation } = route.params || {};
  console.log("Params reçus :", route.params);

  if (!formation) {
    return (
      <View style={styles.container}>
        <Text>Aucune donnée disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {formation.titre || "Formation Bootcamp"}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Likes : {formation.nblike}</Text>
          <Text style={styles.statsText}>Avis : {formation.nbavis}</Text>
          <Text style={styles.statsText}>
            Inscrits : {formation.totalinscrit}
          </Text>
        </View>

        {formation.photofront && (
          <Image
            source={{
              uri: `${IMAGE_BASE_URL1}/${formation.photofront}`,
            }}
            style={styles.image}
          />
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.detailsCardTitle}>Détails Formation</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Niveau :</Text>
            <Text style={styles.detailsValue}>{formation.niveau}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Durée :</Text>
            <Text style={styles.detailsValue}>{formation.duree}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Catégorie :</Text>
            <Text style={styles.detailsValue}>{formation.categorie}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Prix :</Text>
            <Text style={styles.detailsValue}>{formation.prix}DT</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <HTML
          source={{
            html: formation.description || "Aucune description disponible.",
          }}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Plan de formation</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Sections</Text>
            <Text style={styles.headerCell}>Durée</Text>
          </View>
          {formation.sections && formation.sections.length > 0 ? (
            formation.sections.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>
                  {item.titre || "Section inconnue"}
                </Text>
                <Text style={styles.cell}>
                  {item.duree || "Durée inconnue"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.cell}>Aucune section disponible</Text>
          )}
        </View>
      </ScrollView>
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
    marginTop: 60,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#203a72" },
  scrollContainer: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statsText: {
    fontSize: 14,
    color: "#555",
  },
  image: {objectFit:"fill", width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  detailsCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailsCardTitle: {
    backgroundColor: "#f7a81b",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailsValue: {
    fontSize: 16,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#203a72",
    marginTop: 15,
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#203a72",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: { fontSize: 16, color: "#333", flex: 1, textAlign: "center" },
});

export default FormationDetailsScreen;
