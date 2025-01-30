import React from "react";
import { StatusBar } from "react-native";
import Navigation from "./navigation/index"; // Assure-toi que le chemin est correct

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Navigation />
    </>
  );
}
