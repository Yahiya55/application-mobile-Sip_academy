import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card, DataTable, RadioButton } from "react-native-paper";
import ParcoursService from "../service/ParcoursService";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const ParcoursScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("experiences");

  // États des formulaires
  const [formData, setFormData] = useState({
    poste: "",
    typeemploi: "cdi",
    nomdeentreprise: "",
    lieu: "",
    datededebut: "",
    datedefin: "",
    Typedeprofil: "",
    nbexperience: "",
  });

  const [certifFormData, setCertifFormData] = useState({
    titre: "",
    lien: "",
    dateobtention: "",
    datevalidite: "",
    pdf: null,
    image: null,
  });

  const [diplomeFormData, setDiplomeFormData] = useState({
    titre: "",
    dateobtention: "",
    pdf: null,
    image: null,
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCertifFormVisible, setIsCertifFormVisible] = useState(false);
  const [isDiplomeFormVisible, setIsDiplomeFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gestion des dates
  const [showDateModal, setShowDateModal] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);
  const [isForCertif, setIsForCertif] = useState(false);
  const [isForDiplome, setIsForDiplome] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const typeEmploiOptions = ["stage", "civp", "cdi", "cdd"];
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => String(currentYear - i));

  // Sélection de fichiers
  const pickPdfDocument = async (isCertificate = true) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        const fileData = {
          uri: result.uri,
          name: result.name,
          type: "application/pdf",
        };

        if (isCertificate) {
          setCertifFormData({ ...certifFormData, pdf: fileData });
        } else {
          setDiplomeFormData({ ...diplomeFormData, pdf: fileData });
        }
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner le document");
    }
  };

  const pickImage = async (isCertificate = true) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        const imageData = {
          uri: selectedAsset.uri,
          name: selectedAsset.uri.split("/").pop(),
          type: `image/${selectedAsset.uri.split(".").pop()}`,
        };

        if (isCertificate) {
          setCertifFormData({ ...certifFormData, image: imageData });
        } else {
          setDiplomeFormData({ ...diplomeFormData, image: imageData });
        }
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  // Gestion des dates
  const openDatePicker = (fieldName, formType = "experience") => {
    setIsForCertif(formType === "certification");
    setIsForDiplome(formType === "diplome");

    let existingDate = "";
    if (formType === "certification") {
      existingDate = certifFormData[fieldName];
    } else if (formType === "diplome") {
      existingDate = diplomeFormData[fieldName];
    } else {
      existingDate = formData[fieldName];
    }

    if (existingDate) {
      const [year, month, day] = existingDate.split("-");
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(day);
    } else {
      const today = new Date();
      setSelectedYear(String(today.getFullYear()));
      setSelectedMonth(String(today.getMonth() + 1).padStart(2, "0"));
      setSelectedDay(String(today.getDate()).padStart(2, "0"));
    }

    setCurrentDateField(fieldName);
    setShowDateModal(true);
  };

  const confirmDateSelection = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;

      if (isForCertif) {
        setCertifFormData({
          ...certifFormData,
          [currentDateField]: formattedDate,
        });
      } else if (isForDiplome) {
        setDiplomeFormData({
          ...diplomeFormData,
          [currentDateField]: formattedDate,
        });
      } else {
        setFormData({ ...formData, [currentDateField]: formattedDate });
      }
      setShowDateModal(false);
    } else {
      Alert.alert("Erreur", "Veuillez sélectionner une date complète");
    }
  };

  // Soumission des formulaires
  const handleAddExperience = async () => {
    if (Object.values(formData).some((v) => !v)) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const response = await ParcoursService.addExperience(formData);
      if (response.message === "Expérience ajoutée avec succès") {
        Alert.alert("Succès", "Expérience ajoutée !");
        setFormData({
          poste: "",
          typeemploi: "cdi",
          nomdeentreprise: "",
          lieu: "",
          datededebut: "",
          datedefin: "",
          Typedeprofil: "",
          nbexperience: "",
        });
        setIsFormVisible(false);
      }
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificat = async () => {
    if (
      !certifFormData.titre ||
      !certifFormData.lien ||
      !certifFormData.pdf ||
      !certifFormData.image
    ) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs et joindre les fichiers"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await ParcoursService.addCertificat(certifFormData);
      if (response.message === "Certificat ajouté avec succès") {
        Alert.alert("Succès", "Certificat ajouté !");
        setCertifFormData({
          titre: "",
          lien: "",
          dateobtention: "",
          datevalidite: "",
          pdf: null,
          image: null,
        });
        setIsCertifFormVisible(false);
      }
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiplome = async () => {
    if (
      !diplomeFormData.titre ||
      !diplomeFormData.pdf ||
      !diplomeFormData.image
    ) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs et joindre les fichiers"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await ParcoursService.addDiplome(diplomeFormData);
      if (response.message === "Diplôme ajouté avec succès") {
        Alert.alert("Succès", "Diplôme ajouté !");
        setDiplomeFormData({
          titre: "",
          dateobtention: "",
          pdf: null,
          image: null,
        });
        setIsDiplomeFormVisible(false);
      }
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Rendu du contenu
  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case "experiences":
        return (
          <View style={styles.tableContainer}>
            {isFormVisible && (
              <Card style={styles.formCard}>
                <Card.Content>
                  <Text style={styles.formTitle}>Ajouter une expérience</Text>
                  <TextInput
                    placeholder="Poste"
                    value={formData.poste}
                    onChangeText={(text) =>
                      setFormData({ ...formData, poste: text })
                    }
                    style={styles.input}
                  />

                  <Text style={styles.inputLabel}>Type d'emploi</Text>
                  <View style={styles.radioGroup}>
                    {typeEmploiOptions.map((option) => (
                      <View key={option} style={styles.radioItem}>
                        <RadioButton
                          value={option}
                          status={
                            formData.typeemploi === option
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() =>
                            setFormData({ ...formData, typeemploi: option })
                          }
                          color="#1F3971"
                        />
                        <Text>{option.toUpperCase()}</Text>
                      </View>
                    ))}
                  </View>

                  <TextInput
                    placeholder="Nom de l'entreprise"
                    value={formData.nomdeentreprise}
                    onChangeText={(text) =>
                      setFormData({ ...formData, nomdeentreprise: text })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Lieu"
                    value={formData.lieu}
                    onChangeText={(text) =>
                      setFormData({ ...formData, lieu: text })
                    }
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => openDatePicker("datededebut")}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {formData.datededebut || "Date de début"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => openDatePicker("datedefin")}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {formData.datedefin || "Date de fin"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Type de profil"
                    value={formData.Typedeprofil}
                    onChangeText={(text) =>
                      setFormData({ ...formData, Typedeprofil: text })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Années d'expérience"
                    value={formData.nbexperience}
                    onChangeText={(text) =>
                      setFormData({ ...formData, nbexperience: text })
                    }
                    style={styles.input}
                    keyboardType="numeric"
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => setIsFormVisible(false)}
                    >
                      <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleAddExperience}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Envoi..." : "Enregistrer"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            )}

            {user.experiences?.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Poste</DataTable.Title>
                  <DataTable.Title>Entreprise</DataTable.Title>
                  <DataTable.Title>Période</DataTable.Title>
                </DataTable.Header>
                {user.experiences.map((exp, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{exp.poste}</DataTable.Cell>
                    <DataTable.Cell>{exp.nomdeentreprise}</DataTable.Cell>
                    <DataTable.Cell>{`${exp.datededebut} - ${exp.datedefin}`}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="briefcase-outline" size={40} color="#ccc" />
                <Text style={styles.emptyText}>Aucune expérience</Text>
              </View>
            )}
          </View>
        );

      case "certifications":
        return (
          <View style={styles.tableContainer}>
            {isCertifFormVisible && (
              <Card style={styles.formCard}>
                <Card.Content>
                  <Text style={styles.formTitle}>
                    Ajouter une certification
                  </Text>
                  <TextInput
                    placeholder="Titre"
                    value={certifFormData.titre}
                    onChangeText={(text) =>
                      setCertifFormData({ ...certifFormData, titre: text })
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Lien de vérification"
                    value={certifFormData.lien}
                    onChangeText={(text) =>
                      setCertifFormData({ ...certifFormData, lien: text })
                    }
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() =>
                      openDatePicker("dateobtention", "certification")
                    }
                  >
                    <Text style={styles.datePickerButtonText}>
                      {certifFormData.dateobtention || "Date d'obtention"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() =>
                      openDatePicker("datevalidite", "certification")
                    }
                  >
                    <Text style={styles.datePickerButtonText}>
                      {certifFormData.datevalidite || "Date de validité"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filePickerButton}
                    onPress={() => pickPdfDocument(true)}
                  >
                    <Text style={styles.filePickerButtonText}>
                      {certifFormData.pdf?.name || "Sélectionner PDF"}
                    </Text>
                    <Ionicons
                      name="document-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filePickerButton}
                    onPress={() => pickImage(true)}
                  >
                    <Text style={styles.filePickerButtonText}>
                      {certifFormData.image
                        ? "Image sélectionnée"
                        : "Sélectionner image"}
                    </Text>
                    <Ionicons name="image-outline" size={20} color="#1F3971" />
                  </TouchableOpacity>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => setIsCertifFormVisible(false)}
                    >
                      <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleAddCertificat}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Envoi..." : "Enregistrer"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            )}

            {user.certifs?.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Titre</DataTable.Title>
                  <DataTable.Title>Lien</DataTable.Title>
                  <DataTable.Title>Validité</DataTable.Title>
                </DataTable.Header>
                {user.certifs.map((cert, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{cert.titre}</DataTable.Cell>
                    <DataTable.Cell numberOfLines={1}>
                      {cert.lien}
                    </DataTable.Cell>
                    <DataTable.Cell>{cert.datevalidite}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="ribbon-outline" size={40} color="#ccc" />
                <Text style={styles.emptyText}>Aucune certification</Text>
              </View>
            )}
          </View>
        );

      case "diplomes":
        return (
          <View style={styles.tableContainer}>
            {isDiplomeFormVisible && (
              <Card style={styles.formCard}>
                <Card.Content>
                  <Text style={styles.formTitle}>Ajouter un diplôme</Text>
                  <TextInput
                    placeholder="Titre du diplôme"
                    value={diplomeFormData.titre}
                    onChangeText={(text) =>
                      setDiplomeFormData({ ...diplomeFormData, titre: text })
                    }
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => openDatePicker("dateobtention", "diplome")}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {diplomeFormData.dateobtention || "Date d'obtention"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filePickerButton}
                    onPress={() => pickPdfDocument(false)}
                  >
                    <Text style={styles.filePickerButtonText}>
                      {diplomeFormData.pdf?.name || "Sélectionner le PDF"}
                    </Text>
                    <Ionicons
                      name="document-outline"
                      size={20}
                      color="#1F3971"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filePickerButton}
                    onPress={() => pickImage(false)}
                  >
                    <Text style={styles.filePickerButtonText}>
                      {diplomeFormData.image
                        ? "Image sélectionnée"
                        : "Sélectionner une image"}
                    </Text>
                    <Ionicons name="image-outline" size={20} color="#1F3971" />
                  </TouchableOpacity>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => setIsDiplomeFormVisible(false)}
                    >
                      <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleAddDiplome}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Envoi..." : "Enregistrer"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            )}

            {user.diplomes?.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Titre</DataTable.Title>
                  <DataTable.Title>Établissement</DataTable.Title>
                  <DataTable.Title>Date</DataTable.Title>
                </DataTable.Header>
                {user.diplomes.map((dip, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{dip.titre}</DataTable.Cell>
                    <DataTable.Cell>{dip.etablissement}</DataTable.Cell>
                    <DataTable.Cell>{dip.dateobtention}</DataTable.Cell>
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

  // Gestion du bouton d'ajout
  const handleAddButtonPress = () => {
    setIsFormVisible(false);
    setIsCertifFormVisible(false);
    setIsDiplomeFormVisible(false);

    switch (activeTab) {
      case "experiences":
        setIsFormVisible(true);
        break;
      case "certifications":
        setIsCertifFormVisible(true);
        break;
      case "diplomes":
        setIsDiplomeFormVisible(true);
        break;
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
        <TouchableOpacity
          onPress={handleAddButtonPress}
          disabled={
            isFormVisible || isCertifFormVisible || isDiplomeFormVisible
          }
        >
          <Ionicons name="add-circle-outline" size={28} color="#1F3971" />
        </TouchableOpacity>
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
              {["experiences", "certifications", "diplomes"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    activeTab === tab && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Ionicons
                    name={
                      tab === "experiences"
                        ? "briefcase-outline"
                        : tab === "certifications"
                        ? "ribbon-outline"
                        : "school-outline"
                    }
                    size={18}
                    color={activeTab === tab ? "#fff" : "#1F3971"}
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === tab && styles.activeTabButtonText,
                    ]}
                  >
                    {tab === "experiences"
                      ? "Expériences"
                      : tab === "certifications"
                      ? "Certifications"
                      : "Diplômes"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {renderTabContent()}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Modal de sélection de date */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner une date</Text>
            <View style={styles.datePickerContainer}>
              {/* Sélecteur de jour */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Jour</Text>
                <ScrollView
                  style={styles.datePickerScroll}
                  showsVerticalScrollIndicator={true}
                >
                  {days.map((day) => (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.dateOption,
                        selectedDay === day && styles.selectedDateOption,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          selectedDay === day && styles.selectedDateOptionText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Sélecteur de mois */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Mois</Text>
                <ScrollView
                  style={styles.datePickerScroll}
                  showsVerticalScrollIndicator={true}
                >
                  {months.map((month) => (
                    <TouchableOpacity
                      key={`month-${month}`}
                      style={[
                        styles.dateOption,
                        selectedMonth === month && styles.selectedDateOption,
                      ]}
                      onPress={() => setSelectedMonth(month)}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          selectedMonth === month &&
                            styles.selectedDateOptionText,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Sélecteur d'année */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Année</Text>
                <ScrollView
                  style={styles.datePickerScroll}
                  showsVerticalScrollIndicator={true}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={`year-${year}`}
                      style={[
                        styles.dateOption,
                        selectedYear === year && styles.selectedDateOption,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          selectedYear === year &&
                            styles.selectedDateOptionText,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={confirmDateSelection}
              >
                <Text style={styles.modalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Les styles restent identiques à ceux de votre code original
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
  formCard: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#1F3971",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Styles pour le sélecteur de type d'emploi (radio buttons)
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 5,
  },

  // Styles pour le bouton de sélection de date personnalisée
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  datePickerButtonText: {
    color: "#444",
  },

  // Styles pour les champs personnalisés (files & dates)
  fileInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 45,
    justifyContent: "center",
  },
  filePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  filePickerButtonText: {
    color: "#444",
  },

  // Styles pour le modal de sélection de date personnalisé
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F3971",
    marginBottom: 15,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  datePickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  datePickerLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444",
    fontWeight: "bold",
  },
  datePickerScroll: {
    height: 200,
    width: "90%",
  },
  dateOption: {
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedDateOption: {
    backgroundColor: "#e8f0fe",
    borderRadius: 5,
  },
  dateOptionText: {
    fontSize: 16,
  },
  selectedDateOptionText: {
    color: "#1F3971",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
    marginLeft: 10,
  },
  confirmModalButton: {
    backgroundColor: "#1F3971",
  },
  cancelModalButton: {
    backgroundColor: "#ccc",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ParcoursScreen;
