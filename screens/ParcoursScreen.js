import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card, DataTable } from "react-native-paper";

const ParcoursScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("experiences");

  // Rendu de la section des tableaux en fonction de l'onglet actif
  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case "experiences":
        return (
          <View style={styles.tableContainer}>
            {user.experiences && user.experiences.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Poste</DataTable.Title>
                  <DataTable.Title>Entreprise</DataTable.Title>
                  <DataTable.Title>Période</DataTable.Title>
                </DataTable.Header>
                {user.experiences.map((exp, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{exp.poste || "N/A"}</DataTable.Cell>
                    <DataTable.Cell>{exp.entreprise || "N/A"}</DataTable.Cell>
                    <DataTable.Cell>{`${exp.dateDebut || ""} - ${
                      exp.dateFin || "Présent"
                    }`}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="briefcase-outline" size={40} color="#ccc" />
                <Text style={styles.emptyText}>Aucune expérience ajoutée</Text>
              </View>
            )}
          </View>
        );
      case "certifications":
        return (
          <View style={styles.tableContainer}>
            {user.certifs && user.certifs.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Titre</DataTable.Title>
                  <DataTable.Title>Organisme</DataTable.Title>
                  <DataTable.Title>Date</DataTable.Title>
                </DataTable.Header>
                {user.certifs.map((cert, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{cert.titre || "N/A"}</DataTable.Cell>
                    <DataTable.Cell>{cert.organisme || "N/A"}</DataTable.Cell>
                    <DataTable.Cell>{cert.date || "N/A"}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="ribbon-outline" size={40} color="#ccc" />
                <Text style={styles.emptyText}>
                  Aucune certification ajoutée
                </Text>
              </View>
            )}
          </View>
        );
      case "diplomes":
        return (
          <View style={styles.tableContainer}>
            {user.diplomes && user.diplomes.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Diplôme</DataTable.Title>
                  <DataTable.Title>Établissement</DataTable.Title>
                  <DataTable.Title>Année</DataTable.Title>
                </DataTable.Header>
                {user.diplomes.map((diplome, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{diplome.titre || "N/A"}</DataTable.Cell>
                    <DataTable.Cell>
                      {diplome.etablissement || "N/A"}
                    </DataTable.Cell>
                    <DataTable.Cell>{diplome.annee || "N/A"}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="school-outline" size={40} color="#ccc" />
                <Text style={styles.emptyText}>Aucun diplôme ajouté</Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
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
        <Text style={styles.headerTitle}>Mon Parcours</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubtitle}>
            Découvrez votre parcours professionnel et académique
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Mon parcours</Text>
              <Ionicons name="trail-sign-outline" size={22} color="#1F3971" />
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "experiences" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("experiences")}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={activeTab === "experiences" ? "#fff" : "#1F3971"}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "experiences" && styles.activeTabButtonText,
                  ]}
                >
                  Expériences
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "certifications" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("certifications")}
              >
                <Ionicons
                  name="ribbon-outline"
                  size={18}
                  color={activeTab === "certifications" ? "#fff" : "#1F3971"}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "certifications" &&
                      styles.activeTabButtonText,
                  ]}
                >
                Certifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "diplomes" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("diplomes")}
              >
                <Ionicons
                  name="school-outline"
                  size={18}
                  color={activeTab === "diplomes" ? "#fff" : "#1F3971"}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "diplomes" && styles.activeTabButtonText,
                  ]}
                >
                  Diplômes
                </Text>
              </TouchableOpacity>
            </View>

            {renderTabContent()}
          </Card.Content>
        </Card>
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
  headerContainer: {
    backgroundColor: "#2E7D32",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 3,
    borderRadius: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F3971",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1F3971",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: "#1F3971",
  },
  tabButtonText: {
    fontSize: 12,
    color: "#1F3971",
    marginLeft: 2,
  },
  activeTabButtonText: {
    color: "#fff",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 19,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ParcoursScreen;
