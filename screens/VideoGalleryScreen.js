import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Image,
} from "react-native";
import {
  fetchVideos,
  getVideoUrl,
  getVideoCoverUrl,
} from "../service/VideoService";
import Ionicons from "react-native-vector-icons/Ionicons";

const VideoGalleryScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const videosData = await fetchVideos();
      setVideos(videosData);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger les vidéos");
      setLoading(false);
      console.error(err);
    }
  };

  const handleVideoPress = (video) => {
    if (!video.video) {
      console.error("Erreur: chemin de vidéo manquant", video);
      return;
    }

    const videoUrl = getVideoUrl(video.video);
    const coverUrl = video.cover ? getVideoCoverUrl(video.cover) : null;
    console.log("Navigation vers la vidéo:", videoUrl);

    navigation.navigate("VideoPlayer", {
      videoUrl: videoUrl,
      videoTitle: video.titre || "Sans titre",
      videoDescription: video.description || "",
      videoAuthor: video.auteur || "Auteur inconnu",
      videoDate: video.date || "",
      coverUrl: coverUrl,
    });
  };

  const renderVideoItem = ({ item, index }) => {
    // Vérifier si la vidéo a une image de couverture
    const hasCover = item.cover && item.cover.trim() !== "";
    const coverUrl = hasCover ? getVideoCoverUrl(item.cover) : null;

    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handleVideoPress(item)}
      >
        <View style={styles.videoCard}>
          {/* Image de couverture ou placeholder avec couleur de fond */}
          <View style={styles.thumbnailContainer}>
            {hasCover ? (
              <Image
                source={{ uri: coverUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.thumbnailPlaceholder,
                  { backgroundColor: "#3498db" },
                ]}
              >
                <Text style={styles.thumbnailText}>
                  {item.titre ? item.titre.charAt(0).toUpperCase() : "V"}
                </Text>
              </View>
            )}
            <View style={styles.playButton}>
              <Ionicons name="play" size={30} color="white" />
            </View>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {item.titre}
            </Text>
            <Text style={styles.videoAuthor} numberOfLines={1}>
              {item.auteur}
            </Text>
            <Text style={styles.videoDate}>{item.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#1f3971" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Vidéos</Text>
      <View style={styles.placeholder} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1f3971" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadVideos}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f3971",
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 8,
    paddingBottom: 70, // Assurer que le contenu est visible au-dessus de la barre de navigation
  },
  videoItem: {
    flex: 1,
    margin: 6,
    height: 220,
  },
  videoCard: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: "100%",
  },
  thumbnailContainer: {
    height: 130,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Couleur de fond en cas d'échec de chargement
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.5)",
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
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1f3971",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1f3971",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: "white",
    fontSize: 16,
  },
});

export default VideoGalleryScreen;
