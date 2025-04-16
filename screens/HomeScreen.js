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
import { fetchVideos, getVideoUrl } from "../service/VideoService";
import { FormationsService } from "../service/FormationService";
import { getSessions } from "../service/SessionService";
import { IMAGE_BASE_URL, IMAGE_BASE_URL1, IMAGE_BASE_URL2 } from "@env";
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [formations, setFormations] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [videos, setVideos] = useState([]);
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

        // Récupérer les vidéos
        const videosData = await fetchVideos();
        console.log("Vidéos récupérées:", videosData);
        setVideos(videosData || []);
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

  // Fonction pour générer une couleur aléatoire pour les vignettes de vidéo
  const getRandomColor = () => {
    const colors = [
      "#3498db",
      "#2ecc71",
      "#e74c3c",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderVideoItem = ({ item }) => {
    const backgroundColor = getRandomColor();

    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => {
          console.log("Navigation vers VideoPlayer avec:", item);
          const videoUrl = getVideoUrl(item.video);
          console.log("URL vidéo:", videoUrl);

          navigation.navigate("VideoPlayer", {
            videoUrl: videoUrl,
            videoTitle: item.titre || "Sans titre",
            videoDescription: item.description || "",
            videoAuthor: item.auteur || "",
            videoDate: item.date || "",
          });
        }}
      >
        <View style={styles.videoCard}>
          {/* Placeholder coloré avec icône play */}
          <View style={[styles.videoThumbnail, { backgroundColor }]}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={30} color="white" />
            </View>
            {/* Premier caractère du titre comme initiale sur le thumbnail */}
            <Text style={styles.thumbnailText}>
              {item.titre ? item.titre.charAt(0).toUpperCase() : "V"}
            </Text>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {item.titre || "Sans titre"}
            </Text>
            <Text style={styles.videoAuthor} numberOfLines={1}>
              {item.auteur || ""}
            </Text>
            <Text style={styles.videoDate}>{item.date || ""}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title, data, renderItem, navigateTo) => {
    if (!data || data.length === 0) {
      return null; // Ne pas afficher les sections vides
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              if (navigateTo) {
                navigation.navigate(navigateTo);
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
        <View style={styles.photoContainer}>
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
        {renderSection(
          "Formations",
          formations,
          renderFormationItem,
          "Formations"
        )}

        {/* Sessions (dynamique) */}
        {renderSection("Sessions", sessions, renderSessionItem, "Sessions")}

        {/* Actualités (dynamique) */}
        {renderSection(
          "Actualités",
          actualites,
          renderActualiteItem,
          "Actualites"
        )}

        {/* Vidéos (dynamique) */}
        {renderSection("📺 Vidéos", videos, renderVideoItem, "VideoGallery")}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  photoContainer: {
    marginTop: 10,
    marginBottom: 10,
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
  },
  scrollContent: { paddingTop: 60 },
  logo: { width: 150, height: 40, resizeMode: "contain" },
  section: { marginVertical: 15, paddingHorizontal: 15 },
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
    position: "relative",
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
    zIndex: 1,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    zIndex: 1,
  },
  itemTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  actualiteTitle: { color: "#203a72", fontWeight: "bold" },
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#203a72",
  },
  sessionTime: { fontSize: 12 },
  sessionMode: { fontSize: 12, color: "gray" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoList: { marginBottom: 10 },
  photoItem: { marginRight: 10 },
  photoImage: { width: 300, height: 150, borderRadius: 10 },
  videoItem: {
    marginRight: 15,
    width: 230, // Largeur qui permet de voir une vidéo et demie
  },
  videoCard: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoThumbnail: {
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  thumbnailText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.5)",
  },
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f3971",
    marginBottom: 4,
  },
  videoAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  videoDate: {
    fontSize: 12,
    color: "#999",
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
});

export default HomeScreen;
