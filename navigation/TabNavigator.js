import { StyleSheet, View, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import LoadingScreen from "../screens/LoadingScreen";
import ClasseVirtuelleDetailsScreen from "../screens/ClasseVirtuelleDetailsScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
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
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const { width } = Dimensions.get("window");

// Stack pour l'écran d'accueil
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
    <Stack.Screen
      name="Contact"
      component={ContactScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Stack pour les formations
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

// Stack pour les sessions
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

// Stack pour les actualités
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

// Stack pour le profil connecté
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={PersonalProfileScreen} />
    <Stack.Screen name="DetailsProfil" component={DetailsProfilScreen} />
    <Stack.Screen name="Parcours" component={ParcoursScreen} />
    <Stack.Screen name="Deconnexion" component={DeconnexionScreen} />
  </Stack.Navigator>
);

// Stack pour l'authentification
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

// Fonction pour obtenir les icônes des onglets
const getTabBarIcon = (route, focused, color, size) => {
  let iconName;
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

// Options pour le Tab Navigator
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

// Tab Navigator pour le mode INVITÉ
const GuestTabNavigator = () => (
  <Tab.Navigator {...tabNavigatorOptions} initialRouteName="Home">
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Formations" component={FormationsStack} />
    <Tab.Screen name="Sessions" component={SessionsStack} />
    <Tab.Screen name="Actualites" component={ActualitesStack} />
    <Tab.Screen name="Contacts" component={ContactScreen} />
    <Tab.Screen name="Mon Profil" component={PersonalProfileScreen} />
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

// Composant principal de navigation
export default function RootNavigator() {
  const { userToken, isLoading, checkToken } = useAuth();

  // Initialisation des notifications push
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission refusée pour les notifications");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo Push Token:", token);
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
        const subscription = Notifications.addNotificationReceivedListener(
          (notification) => {
            console.log("Notification reçue :", notification);
          }
        );
        const responseSubscription =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Interaction avec la notification :", response);
          });
        return () => {
          subscription.remove();
          responseSubscription.remove();
        };
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation des notifications :",
          error
        );
      }
    };
    initializeNotifications();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <MainStack.Screen
          name="ConnectedTabs"
          component={ConnectedTabNavigator}
        />
      ) : (
        <>
          <MainStack.Screen name="Auth" component={AuthStack} />
          <MainStack.Screen name="GuestTabs" component={GuestTabNavigator} />
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
