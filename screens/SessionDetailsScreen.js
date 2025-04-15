import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native"; // Ajout de useNavigation
import { Ionicons } from "@expo/vector-icons";
import HTML from "react-native-render-html";
import { IMAGE_BASE_URL2 } from "@env";
import { formaterDateTime } from "../utils/dateFormater";
import { FormationsService } from "../service/FormationService";

const SessionDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Utilisation du hook useNavigation
  const { session } = route.params;

  const [formation, setFormation] = useState(null);

  useEffect(() => {
    const fetchFormationDetails = async () => {
      try {
        if (session && session.formation) {
          const data = await FormationsService.getFormationsdetails(
            session.formation.split("/")[3]
          );
          setFormation(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails de formation:",
          error
        );
      }
    };

    fetchFormationDetails();
  }, [session]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Aucune donnée disponible pour cette session.</Text>
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
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="cart-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Titre FIXE */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{session.titre}</Text>
      </View>

      {/* Contenu défilant */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Image */}
        <Image
          source={{ uri: `${IMAGE_BASE_URL2}/${session.image}` }}
          style={styles.image}
        />

        {/* Détails sous l'image */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#203a72" />
            <View>
              <Text style={styles.detailLabel}>Date Début</Text>
              <Text style={styles.detailValue}>
                {formaterDateTime(session.starttime)}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#203a72" />
            <View>
              <Text style={styles.detailLabel}>Date Fin</Text>
              <Text style={styles.detailValue}>
                {formaterDateTime(session.endtime)}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#203a72" />
            <View>
              <Text style={styles.detailLabel}>Adresse</Text>
              <Text style={styles.detailValue}>{session.adresse}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="pricetag-outline" size={20} color="green" />
            <View>
              <Text style={styles.detailLabel}>Prix Promo</Text>
              <Text style={[styles.detailValue, styles.price]}>
                {session.prixpromo} DT
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <HTML
          source={{ html: session.description }}
          contentWidth={styles.scrollContainer.width}
        />

        {/* Plan de Formation */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Plan de formation</Text>
          {formation && formation.sections ? (
            formation.sections.length > 0 ? (
              <>
                {/* En-tête du tableau */}
                <View style={styles.tableHeader}>
                  <Text style={styles.headerCell}>Sections</Text>
                  <Text style={styles.headerCell}>Durée</Text>
                </View>

                {/* Contenu du tableau */}
                {formation.sections.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.cell}>
                      {item.titre || "Section inconnue"}
                    </Text>
                    <Text style={styles.cell}>
                      {item.duree || "Durée inconnue"}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.noDataText}>Aucune section disponible.</Text>
            )
          ) : (
            <Text style={styles.noDataText}>
              Erreur lors de la récupération des sections.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Boutons en bas de l'écran */}
      <View style={styles.footerButtonsContainer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.buyNowButton]}
          onPress={() => console.log("Acheter maintenant")}
        >
          <Text style={styles.footerButtonText}>Acheter maintenant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.addToCartButton]}
          onPress={() => navigation.navigate("Cartscreen")} // Navigation vers l'écran "Panier"
        >
          <Text style={styles.footerButtonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles (inchangés)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    width: 120,
    height: 35,
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  titleContainer: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 15,
    marginTop: 70,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#203a72",
  },
  scrollContainer: {
    flex: 1,
    marginTop: 70,
  },
  scrollContentContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 120,
  },
  image: {
    objectFit: "fill",
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#203a72",
    marginLeft: 5,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  price: {
    color: "green",
    fontWeight: "bold",
  },
  sectionContainer: {
    marginTop: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#203a72",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#203a72",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    fontSize: 14,
    color: "#333",
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    zIndex: 1000,
  },
  footerButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buyNowButton: {
    backgroundColor: "#203a72",
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 50,
    borderRadius: 5,
    width: "100%",
  },
  addToCartButton: {
    backgroundColor: "gold",
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 50,
    borderRadius: 5,
    width: "100%",
  },
  footerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SessionDetailsScreen;
