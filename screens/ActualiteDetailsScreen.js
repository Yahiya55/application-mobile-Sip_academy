import React from "react";
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
import { IMAGE_BASE_URL } from "@env";
import { formaterDate } from "../utils/dateFormater";
import HTML from "react-native-render-html";

const ActualiteDetailsScreen = () => {
  const route = useRoute();
  const { actualite } = route.params;
  console.log(actualite);

  const description = `
   <p>Félicitations à notre chère candidate Mariem Ben Arfi d'avoir obtenu avec excellence son certificat OCA 1Z0-808</p>
  `;

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

      {/* Titre de l'actualité */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{actualite.titre}</Text>
      </View>

      {/* Contenu Scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image */}
        <Image
          source={{ uri: IMAGE_BASE_URL + "/" + actualite.image }}
          style={styles.image}
        />
        {/* Date */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={20} color="#203a72" />
          <Text style={styles.date}>{formaterDate(actualite.date)}</Text>
        </View>
        {/* Description */}
        <ScrollView style={{ flex: 1 }}>
          <HTML source={{ html: actualite.description }} />
        </ScrollView>{" "}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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

  /* Titre de l'actualité */
  titleContainer: {
    padding: 15,
    marginTop: 60,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#203a72" },

  /* Contenu Scrollable */
  scrollContainer: { paddingHorizontal: 15, paddingBottom: 30 },

  image: {objectFit:"fill", width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  date: { fontSize: 14, color: "#757575", marginLeft: 5 },

  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    marginBottom: 20,
  },
});

export default ActualiteDetailsScreen;
