import React from "react";
import { LogBox } from "react-native"; // Import LogBox pour masquer les avertissements spécifiques
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import { navigationRef } from "./RootNavigation";
import { name as appName } from "./app.json";

// Ignorer l'avertissement spécifique lié à react-native-render-html
LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer: Support for defaultProps will be removed",
]);

// Composant principal de l'application
const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  );
};

// Enregistrez l'application
AppRegistry.registerComponent(appName, () => App);
