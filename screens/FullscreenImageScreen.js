import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FullscreenImageScreen = ({ route, navigation }) => {
  const { images, currentIndex } = route.params;

  // Fonction pour naviguer entre les images
  const handleNavigate = (direction) => {
    if (direction === "next") {
      if (currentIndex < images.length - 1) {
        navigation.replace("FullscreenImage", {
          images,
          currentIndex: currentIndex + 1,
        });
      }
    } else if (direction === "prev") {
      if (currentIndex > 0) {
        navigation.replace("FullscreenImage", {
          images,
          currentIndex: currentIndex - 1,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <Image source={{ uri: images[currentIndex].uri }} style={styles.image} />

      <TouchableOpacity
        style={styles.prevButton}
        onPress={() => handleNavigate("prev")}
      >
        <Ionicons name="chevron-back" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => handleNavigate("next")}
      >
        <Ionicons name="chevron-forward" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  prevButton: {
    position: "absolute",
    left: 20,
    bottom: 50,
    zIndex: 1,
  },
  nextButton: {
    position: "absolute",
    right: 20,
    bottom: 50,
    zIndex: 1,
  },
});

export default FullscreenImageScreen;
