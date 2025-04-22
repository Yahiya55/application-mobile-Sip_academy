import { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import du LoadingScreen
import LoadingScreen from "../screens/LoadingScreen";
import ClasseVirtuelleDetailsScreen from "../screens/ClasseVirtuelleDetailsScreen";

// Mode Général (Non-connecté)
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

// Mode Connecté + Invité
import HomeScreen from "../screens/HomeScreen";
import FormationsScreen from "../screens/FormationsScreen";
import FormationDetailsScreen from "../screens/FormationDetailsScreen";
import SessionDetailsScreen from "../screens/SessionDetailsScreen";
import ActualitesScreen from "../screens/ActualitesScreen";
import ActualiteDetailsScreen from "../screens/ActualiteDetailsScreen";
import VideoPlayerScreen from "../screens/VideoPlayerScreen";
import VideoGalleryScreen from "../screens/VideoGalleryScreen";
import SessionsScreen from "../screens/SessionsScreen";
import ContactScreen from "../screens/ContactScreen";
import PersonalProfileScreen from "../screens/PersonalProfileScreen";
import DetailsProfilScreen from "../screens/DetailsProfilScreen";
import ParcoursScreen from "../screens/ParcoursScreen";
import DeconnexionScreen from "../screens/DeconnexionScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

const { width } = Dimensions.get("window");

// Stack pour l'écran d'accueil - accessible pour tous les utilisateurs
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Accueil" component={HomeScreen} />
    <Stack.Screen name="VideoGallery" component={VideoGalleryScreen} />
    <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    <Stack.Screen name="Sessions" component={SessionsScreen} />
    <Stack.Screen name="Actualites" component={ActualitesScreen} />
    <Stack.Screen name="Formations" component={FormationsScreen} />
    <Stack.Screen
      name="FormationDetails"
      component={FormationDetailsScreen}
      options={({ route }) => ({
        title: route.params?.formation?.title || "Détails Formation",
      })}
    />
    <Stack.Screen
      name="ActualiteDetails"
      component={ActualiteDetailsScreen}
      options={({ route }) => ({
        title: route.params?.actualite?.title || "Détails Actualité",
      })}
    />
    <Stack.Screen
      name="SessionDetails"
      component={SessionDetailsScreen}
      options={({ route }) => ({
        title: route.params?.session?.title || "Détails Session",
      })}
    />
  </Stack.Navigator>
);

// Stack pour les formations - accessible pour invités et connectés
const FormationsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ListFormations" component={FormationsScreen} />
    <Stack.Screen
      name="FormationDetails"
      component={FormationDetailsScreen}
      options={({ route }) => ({
        title: route.params?.formation?.title || "Détails Formation",
      })}
    />
  </Stack.Navigator>
);

// Stack pour les sessions - accessible pour invités et connectés
const SessionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ListeSessions" component={SessionsScreen} />
    <Stack.Screen
      name="SessionDetails"
      component={SessionDetailsScreen}
      options={({ route }) => ({
        title: route.params?.session?.title || "Détails Session",
      })}
    />
    <Stack.Screen
      name="ClasseVirtuelleDetails"
      component={ClasseVirtuelleDetailsScreen}
    />
  </Stack.Navigator>
);

// Stack pour les actualités - accessible pour invités et connectés
const ActualitesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ListeActualites" component={ActualitesScreen} />
    <Stack.Screen
      name="ActualiteDetails"
      component={ActualiteDetailsScreen}
      options={({ route }) => ({
        title: route.params?.actualite?.title || "Détails Actualité",
      })}
    />
  </Stack.Navigator>
);

// Nouvelle Stack pour le profil - accessible pour utilisateurs connectés
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={PersonalProfileScreen} />
    <Stack.Screen name="DetailsProfil" component={DetailsProfilScreen} />
    <Stack.Screen name="Parcours" component={ParcoursScreen} />
    <Stack.Screen name="Deconnexion" component={DeconnexionScreen} />
  </Stack.Navigator>
);

// Stack pour l'authentification - accessible uniquement en mode général
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
    />
  </Stack.Navigator>
);

const getTabBarIcon = (route, focused, color, size) => {
  let iconName;

  // Définir des icônes pour chaque onglet
  if (route.name === "Home") {
    iconName = focused ? "home" : "home-outline";
  } else if (route.name === "Formations") {
    iconName = focused ? "school" : "school-outline";
  } else if (route.name === "Sessions") {
    iconName = focused ? "calendar" : "calendar-outline";
  } else if (route.name === "Actualites") {
    iconName = focused ? "newspaper" : "newspaper-outline";
  } else if (route.name === "Contacts") {
    iconName = focused ? "call" : "call-outline";
  } else if (route.name === "Mon Profil") {
    iconName = focused ? "person" : "person-outline";
  } else if (route.name === "Login") {
    iconName = focused ? "log-in" : "log-in-outline";
  }

  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={iconName}
        color={color}
        size={focused ? 32 : 28}
        style={styles.icon}
      />
    </View>
  );
};

const tabNavigatorOptions = {
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) =>
      getTabBarIcon(route, focused, color, size),
    tabBarStyle: styles.tabBar,
    tabBarShowLabel: false,
    tabBarActiveTintColor: "#ffc107",
    tabBarInactiveTintColor: "#C0C0C0",
    headerShown: false,
  }),
};

// Tab Navigator pour le mode INVITÉ - Définir comme composant React normal
const GuestTabNavigator = ({ isGuestMode }) => (
  <Tab.Navigator {...tabNavigatorOptions} initialRouteName="Home">
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Formations" component={FormationsStack} />
    <Tab.Screen name="Sessions" component={SessionsStack} />
    <Tab.Screen name="Actualites" component={ActualitesStack} />
    <Tab.Screen name="Contacts" component={ContactScreen} />
    <Tab.Screen
      name="Mon Profil"
      component={isGuestMode ? PersonalProfileScreen : LoginScreen}
    />
  </Tab.Navigator>
);

// Tab Navigator pour le mode CONNECTÉ
const ConnectedTabNavigator = () => (
  <Tab.Navigator {...tabNavigatorOptions} initialRouteName="Home">
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Sessions" component={SessionsStack} />
    <Tab.Screen name="Mon Profil" component={ProfileStack} />
  </Tab.Navigator>
);

// Créer un composant séparé pour GuestTabs pour éviter la fonction inline
const GuestTabs = ({ isGuestMode }) => (
  <GuestTabNavigator isGuestMode={isGuestMode} />
);

// Composant principal de navigation
export default function RootNavigator() {
  const [userToken, setUserToken] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false); // Définir isGuestMode ici
  const [isLoading, setIsLoading] = useState(true);

  // Récupération du token au chargement avec délai minimum
  useEffect(() => {
    const checkToken = async () => {
      try {
        const startTime = Date.now();
        console.log("Vérification du token...");
        const token = await AsyncStorage.getItem("token");
        const guestMode = await AsyncStorage.getItem("guestMode");
        setIsGuestMode(guestMode === "true"); // Mettre à jour isGuestMode selon guestMode
        console.log("Token trouvé:", token ? "Oui" : "Non");
        setUserToken(token);

        // S'assurer que le LoadingScreen est affiché au moins 1 seconde
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 1000 - elapsedTime;

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // Afficher le LoadingScreen pendant la vérification du token
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Structure principale de navigation
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        // Mode CONNECTÉ
        <MainStack.Screen
          name="ConnectedTabs"
          component={ConnectedTabNavigator}
        />
      ) : (
        // Mode NON-CONNECTÉ - Choisir entre Auth ou Invité
        <>
          <MainStack.Screen name="Auth" component={AuthStack} />
          <MainStack.Screen name="GuestTabs">
            {(props) => <GuestTabs {...props} isGuestMode={isGuestMode} />}
          </MainStack.Screen>
        </>
      )}
    </MainStack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: width * 0.05,
    right: width * 0.05,
    height: 55,
    borderRadius: 40,
    backgroundColor: "#1f3971",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    width: 55,
    borderRadius: 30,
  },
  activeIconContainer: {
    borderRadius: 30,
  },
  icon: {
    marginTop: -20,
  },
});
