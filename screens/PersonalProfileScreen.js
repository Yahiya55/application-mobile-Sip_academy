import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  Linking,
} from "react-native";
import { getUserById } from "../service/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { DevSettings } from "react-native";
import { CommonActions } from "@react-navigation/native";

import {
  Portal,
  Dialog,
  Button,
  Snackbar,
  Card,
  DataTable,
} from "react-native-paper";

const PersonalProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // États pour les alertes Material UI
  const [guestModeDialogVisible, setGuestModeDialogVisible] = useState(false);
  const [expiredSessionDialogVisible, setExpiredSessionDialogVisible] =
    useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // États pour l'affichage des tableaux
  const [activeTab, setActiveTab] = useState("experiences");

  const navigation = useNavigation();

  const decode = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.warn("Erreur lors du décodage du token");
      return null;
    }
  };

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const guestMode = await AsyncStorage.getItem("guestMode");

        // Vérifier d'abord s'il y a un token valide
        if (storedToken) {
          setToken(storedToken);
          setIsGuestMode(false); // Assurer que le mode invité est désactivé si un token existe
          return; // Sortir de la fonction car le token existe
        }

        // Si aucun token, vérifier le mode invité
        if (guestMode === "true") {
          setIsGuestMode(true);
          setToken(null);
        } else {
          // Si ni token ni mode invité, il y a une erreur
          setError("Token d'authentification manquant.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du mode:", err);
        setError("Erreur lors de la vérification de l'authentification.");
      } finally {
        if (!token) {
          setLoading(false); // Arrêter le chargement si pas de token
        }
      }
    };

    fetchMode();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const jwtData = decode(token);

        if (jwtData) {
          await AsyncStorage.setItem("id", JSON.stringify(jwtData.id));
          const userData = await getUserById(jwtData.id, token);

          if (userData && userData[0]) {
            setUser(userData[0]);
          } else {
            setError("Aucune donnée utilisateur trouvée.");
          }
        } else {
          setError("Erreur lors du décodage du token.");
        }
      } catch (err) {
        if (err.message && err.message.includes("Expired JWT Token")) {
          // Afficher l'alerte Material UI pour la session expirée
          setExpiredSessionDialogVisible(true);
        } else {
          setError("Erreur lors de la récupération des données utilisateur.");
          console.error("Erreur:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const reloadApp = () => {
    console.log("Rechargement de l'application...");
    DevSettings.reload();
  };

  const handleLogout = async () => {
    try {
      console.log("Tentative de déconnexion...");
      await AsyncStorage.removeItem("token");
      console.log("Token supprimé!");

      // Afficher l'alerte de déconnexion réussie
      setSnackbarMessage("Déconnexion réussie");
      setSnackbarVisible(true);

      // Recharger l'application après un court délai
      setTimeout(() => {
        reloadApp();
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setSnackbarMessage("Impossible de vous déconnecter. Veuillez réessayer.");
      setSnackbarVisible(true);
    }
  };

  // Navigation correcte vers l'écran de connexion à partir du mode invité
  const navigateToLogin = () => {
    // Navigation vers l'écran de connexion dans le AuthStack
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    );
  };

  // Ouvrir le CV si disponible
  const openCV = () => {
    if (user && user.cv && user.cv !== "-") {
      Linking.openURL(user.cv).catch(() => {
        setSnackbarMessage("Impossible d'ouvrir le CV");
        setSnackbarVisible(true);
      });
    } else {
      setSnackbarMessage("Aucun CV disponible");
      setSnackbarVisible(true);
    }
  };

  // Récupérer l'URL de l'image de profil
  const getProfileImageUrl = () => {
    // URL de base pour les images
    const baseUrl = "https://mobile.sip-academy.com/uploads/coach/";

    // Si l'utilisateur a un logo et que ce logo n'est pas "-"
    if (user && user.logo && user.logo !== "-") {
      return `${baseUrl}${user.logo}`;
    }

    // URL de l'image par défaut
    return `${baseUrl}student-68077164d5a8c.jpg`;
  };

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

  // Afficher le loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1F3971" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  // Afficher les erreurs
  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace("Mon Profil")}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher le mode invité
  if (isGuestMode) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-outline" size={50} color="#1F3971" />
        <Text style={styles.noUserText}>
          Connectez-vous pour accéder à plus d'informations sur votre profil.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setGuestModeDialogVisible(true)}
        >
          <Text style={styles.retryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        {/* Dialogue pour mode invité */}
        <Portal>
          <Dialog
            visible={guestModeDialogVisible}
            onDismiss={() => setGuestModeDialogVisible(false)}
          >
            <Dialog.Title>Connexion requise</Dialog.Title>
            <Dialog.Content>
              <Text>
                Vous êtes en mode invité. Connectez-vous pour accéder à votre
                profil.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setGuestModeDialogVisible(false);
                  navigateToLogin();
                }}
              >
                Se connecter
              </Button>
              <Button onPress={() => setGuestModeDialogVisible(false)}>
                Annuler
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  // Vérifier si l'utilisateur a été chargé correctement
  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>
          Impossible de charger les données utilisateur.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace("Mon Profil")}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher le profil utilisateur connecté
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutDialogVisible(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: getProfileImageUrl(),
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{`${user.prenom} ${user.nom}`}</Text>
        </View>

        {/* Biographie Section */}
        <View style={styles.formContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Biographie</Text>
                <Ionicons name="book-outline" size={22} color="#1F3971" />
              </View>
              <Text style={styles.biographyText}>
                {user.Biographie && user.Biographie !== "-"
                  ? user.Biographie
                  : "Aucune biographie disponible."}
              </Text>
            </Card.Content>
          </Card>

          {/* CV Section */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Curriculum Vitae</Text>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#1F3971"
                />
              </View>
              {user.cv && user.cv !== "-" ? (
                <TouchableOpacity style={styles.cvButton} onPress={openCV}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color="#fff"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.cvButtonText}>Voir mon CV</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.emptyText}>Aucun CV disponible.</Text>
              )}
            </Card.Content>
          </Card>

          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="person"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={`${user.prenom} ${user.nom}`}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="mail"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.email}
                editable={false}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Coordonnées</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone principal</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="call"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.tel1 !== "-" ? user.tel1 : "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone secondaire</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.tel2 !== "-" ? user.tel2 : "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="location"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.adresse !== "-" ? user.adresse : "Non spécifiée"}
                editable={false}
                multiline={true}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Réseaux sociaux</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>LinkedIn</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="logo-linkedin"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.linkedin !== "-" ? user.linkedin : "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Facebook</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="logo-facebook"
                size={20}
                color="#1F3971"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={user.facebook !== "-" ? user.facebook : "Non spécifié"}
                editable={false}
              />
            </View>
          </View>

          {/* Tableau pour les expériences, certifications et diplômes */}
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
        </View>
      </ScrollView>

      {/* Portail pour les alertes Material UI */}
      <Portal>
        {/* Dialogue pour la déconnexion */}
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Déconnexion</Dialog.Title>
          <Dialog.Content>
            <Text>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setLogoutDialogVisible(false);
                handleLogout();
              }}
            >
              Confirmer
            </Button>
            <Button onPress={() => setLogoutDialogVisible(false)}>
              Annuler
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Dialogue pour la session expirée */}
        <Dialog
          visible={expiredSessionDialogVisible}
          onDismiss={() => setExpiredSessionDialogVisible(false)}
        >
          <Dialog.Title>Session expirée</Dialog.Title>
          <Dialog.Content>
            <Text>Votre session a expiré. Veuillez vous reconnecter.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setExpiredSessionDialogVisible(false);
                AsyncStorage.removeItem("token");
                navigateToLogin();
              }}
            >
              Se connecter
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar pour les notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#1F3971",
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  noUserText: {
    marginTop: 10,
    color: "#333",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#1F3971",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F3971",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#1F3971",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F3971",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    marginVertical: 15,
    elevation: 2,
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  biographyText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1F3971",
  },
  cvButton: {
    flexDirection: "row",
    backgroundColor: "#1F3971",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  cvButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  btnIcon: {
    marginRight: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
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
    marginLeft: 5,
  },
  activeTabButtonText: {
    color: "#fff",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
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

export default PersonalProfileScreen;
