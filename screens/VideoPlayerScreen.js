import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";

const VideoPlayerScreen = () => {
  const route = useRoute();
  const { videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videoUrl }}
        style={styles.video}
        allowsFullscreenVideo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", marginBottom: 50 },
  video: { width: "100%", height: "100%" },
});

export default VideoPlayerScreen;
