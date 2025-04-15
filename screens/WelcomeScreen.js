import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec logo */}
      <View style={styles.header}>
        <Image style={styles.logo} source={require("../assets/sipwhite.png")} />
      </View>

      {/* Contenu principal */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Bienvenue dans l'avenir de l'éducation</Text>
        <Text style={styles.subtitle}>
          Rejoignez la famille <Text style={styles.brand}>SIPACADEMY</Text> et
          libérez le potentiel de votre esprit.
        </Text>

        {/* Bouton S'INSCRIRE */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        {/* Texte d'options */}
        <View style={styles.guestContainer}>
          <Text style={styles.guestText}>
            Rejoindre <Text style={styles.brand}>SIPACADEMY</Text> :
          </Text>
          <View style={styles.linkContainer}>
            {/* Lien "Se connecter" */}
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.link}>Se connecter</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            {/* Lien "Invité" - Navigation vers le mode invité */}
            <TouchableOpacity
              onPress={() => {
                // Navigation vers le tab invité avec reset pour nettoyer la pile
                navigation.reset({
                  index: 0,
                  routes: [{ name: "GuestTabs" }],
                });
              }}
            >
              <Text style={styles.link}>Invité</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F3971",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    padding: 30,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F3971",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  brand: {
    color: "#ffa500",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1F3971",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  guestContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  guestText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    fontSize: 16,
    color: "#1F3971",
    fontWeight: "bold",
  },
  separator: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 5,
  },
});

export default WelcomeScreen;
