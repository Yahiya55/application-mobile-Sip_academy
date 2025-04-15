// LoadingScreen.js
import React from "react";
import { View, ActivityIndicator, StyleSheet, Text, Image } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/sipwhite.png")} />
      <ActivityIndicator size="large" color="#FFC107" style={styles.loader} />
      <Text style={styles.text}>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F3971",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 30,
  },
  loader: {
    marginVertical: 20,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default LoadingScreen;
