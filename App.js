import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import RootNavigator from "./navigation/TabNavigator"; // Chemin à ajuster selon votre structure

// Vous pouvez personnaliser le thème si vous le souhaitez
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1F3971", // Couleur principale de votre application
    accent: "#f1c40f",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
