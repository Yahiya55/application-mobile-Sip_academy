import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { ActualiteService } from "../service/actualiteservice";
import { FormationsService } from "../service/FormationService";
import { getSessions } from "../service/SessionService"; // Importez le service de sessions
import { IMAGE_BASE_URL, IMAGE_BASE_URL1, IMAGE_BASE_URL2 } from "@env"; // Importez les variables d'environnement
import { formaterDate, formaterDateTime } from "../utils/dateFormater";

const photos = [
  {
    id: "1",
    uri: "https://sip-academy.com/uploads/gallery/20241213_164103-6770537589e61.jpg",
  },
  {
    id: "2",
    uri: "https://sip-academy.com/uploads/gallery/20241211_143400-6770535f71301.jpg",
  },
  {
    id: "3",
    uri: "https://sip-academy.com/uploads/gallery/20241213_164055-67705290760bd.jpg",
  },
];

const videos = [
  {
    id: "1",
    title: "Springboot - C'est quoi ?",
    url: "https://www.youtube.com/embed/lXec-HEZjqs",
  },
  {
    id: "2",
    title: "C'est quoi Angular ?",
    url: "https://www.youtube.com/embed/Vx457brS02Q",
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [formations, setFormations] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [sessions, setSessions] = useState([]); // État pour les sessions
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les formations
        const formationsData = await FormationsService.getFormations();
        setFormations(formationsData["hydra:member"] || []);

        // Récupérer les actualités
        const actualitesData = await ActualiteService.getActualites();
        setActualites(actualitesData["hydra:member"] || []);

        // Récupérer les sessions
        const sessionsData = await getSessions();
        setSessions(sessionsData["hydra:member"] || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderPhotoItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedIndex(photos.findIndex((img) => img.id === item.id));
        setModalVisible(true);
      }}
    >
      <View style={styles.photoItem}>
        <Image source={{ uri: item.uri }} style={styles.photoImage} />
      </View>
    </TouchableOpacity>
  );

  const renderActualiteItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ActualiteDetails", { actualite: item })
      }
    >
      <View style={styles.actualiteItem}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}/${item.image}` }}
          style={styles.actualiteImage}
        />
        <View style={styles.overlayDate}>
          <Text style={styles.actualiteDate}>{formaterDate(item.date)}</Text>
        </View>
        <View style={styles.actualiteContent}>
          <Text style={styles.actualiteTitle}>{item.titre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("SessionDetails", { session: item })}
    >
      <View style={styles.sessionItem}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL2}/${item.image}` }}
          style={styles.sessionImage}
        />
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{item.titre}</Text>
          <Text style={styles.sessionTime}>
            {formaterDateTime(item.starttime)} -{" "}
            {formaterDateTime(item.endtime)}
          </Text>
          <Text style={styles.sessionMode}>{item.adresse}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFormationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("FormationDetails", { formation: item })
      }
    >
      <View style={styles.item}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL1}/${item.photofront}` }}
          style={styles.itemImage}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.itemTitle}>{item.titre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title, data, renderItem) => {
    if (!data || data.length === 0) {
      return null; // Ne pas afficher les sections vides
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              if (title === "Formations") {
                navigation.navigate("Formations");
              } else if (title === "Sessions") {
                navigation.navigate("Sessions");
              } else if (title === "Actualités") {
                navigation.navigate("Actualites");
              }
            }}
          >
            <Text style={styles.seeAll}>VOIR TOUT &gt;</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => `${title}-${item.id}`}
        />
      </View>
    );
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("VideoPlayer", { videoUrl: item.url })}
      style={styles.videoCard}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="play-circle-outline" size={70} color="#ffffff" />
      </View>
      <Text style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Sections */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}
      >
        {/* Photos (statique) */}
        <View style={styles.container}>
          <FlatList
            data={photos}
            horizontal
            style={styles.photoList}
            showsHorizontalScrollIndicator={false}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <View style={styles.modalContent}>
              <Image
                source={{ uri: photos[selectedIndex].uri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />

              {/* ScrollView pour défiler les images */}
              <ScrollView
                horizontal
                contentContainerStyle={styles.scrollViewContainer}
                showsHorizontalScrollIndicator={false}
              >
                {photos.map((image, index) => (
                  <TouchableOpacity
                    key={image.id}
                    onPress={() => setSelectedIndex(index)}
                    style={styles.scrollItem}
                  >
                    <Image
                      source={{ uri: image.uri }}
                      style={[
                        styles.scrollImage,
                        selectedIndex === index && styles.selectedImage,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* Formations (dynamique) */}
        {renderSection("Formations", formations, renderFormationItem)}

        {/* Sessions (dynamique) */}
        {renderSection("Sessions", sessions, renderSessionItem)}

        {/* Actualités (dynamique) */}
        {renderSection("Actualités", actualites, renderActualiteItem)}

        {/* Vidéos (statique) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📺 Vidéos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>VOIR TOUT &gt;</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={videos}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
          />
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
  scrollContent: { paddingTop: 60 },
  logo: { width: 150, height: 40, resizeMode: "contain" },
  section: { marginVertical: 20, paddingHorizontal: 15 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { fontSize: 10, color: "#203a72", fontWeight: "bold" },
  item: {
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
    width: 310,
    height: 200,
    position: "relative", // Nécessaire pour positionner les enfants en absolu
  },
  itemImage: {
    objectFit: "fill",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  overlayDate: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 1, // Assure que la date est au-dessus de l'image
  },
  itemDate: {
    color: "#f4a100",
    fontSize: 12,
  },
  titleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fond semi-transparent
    padding: 10,
    zIndex: 1, // Assure que le titre est au-dessus de l'image
  },
  itemTitle: {
    color: "#fff", // Texte en blanc
    fontWeight: "bold",
    fontSize: 16, // Taille du texte
  },
  actualiteItem: {
    marginRight: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    width: 310,
    height: 200,
  },
  actualiteImage: {
    objectFit: "fill",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  actualiteContent: { position: "absolute", bottom: 10, left: 10, padding: 10 },
  actualiteTitle: { color: "#203a72", fontWeight: "bold" }, // Titre en bleu
  actualiteDate: { color: "#fff", fontSize: 12 },
  sessionItem: {
    marginRight: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    width: 310,
    height: 150,
  },
  sessionImage: {
    objectFit: "fill",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  sessionInfo: { padding: 10 },
  sessionTitle: {
    sessionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#203a72", // Couleur du texte
    },
  },
  sessionTime: { fontSize: 12 },
  sessionMode: { fontSize: 12, color: "gray" },
  videoItem: { marginBottom: 15 },
  video: { width: "100%", height: 200 },
  videoTitle: { textAlign: "center", marginTop: 5, fontWeight: "bold" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoList: { marginBottom: 20 },
  photoItem: { marginRight: 10 },
  photoImage: { width: 300, height: 150, borderRadius: 10 },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  galleryContainer: {
    padding: 4,
  },
  galleryItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 4,
  },
  thumbnailImage: {
    flex: 1,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  scrollViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  scrollItem: {
    marginHorizontal: 10,
  },
  scrollImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    opacity: 0.7,
  },
  selectedImage: {
    borderColor: "#fff",
    borderWidth: 2,
    opacity: 1,
  },
  videoCard: {
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#203a72", // Fond de la carte (personnalisez)
    borderRadius: 15,
    padding: 20,
    width: 150,
    elevation: 5, // Pour donner une ombre légère (Android)
    shadowColor: "#000", // Ombre sur iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: "center",
    height: 170,
  },
  iconContainer: {
    backgroundColor: "#f4a100", // Couleur d'arrière-plan de l'icône
    borderRadius: 50,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
