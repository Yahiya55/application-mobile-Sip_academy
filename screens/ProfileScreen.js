import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getUserById } from "../service/UserService";


const ProfileScreen = ({ route, navigation }) => {
  const userId = route?.params?.users; // Vérifiez si `users` est transmis
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Erreur", "ID utilisateur manquant.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
        Alert.alert(
          "Erreur",
          error.message ||
            "Impossible de récupérer les données de l'utilisateur."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Utilisateur non trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Section USERNAME */}
      <View style={styles.header}>
        <Text style={styles.username}>
          {user.prenom} {user.nom}
        </Text>
      </View>

      {/* Section Personal Profile */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("PersonalProfile", { userId })}
      >
        <Text style={styles.menuText}>Personal Profile</Text>
      </TouchableOpacity>

      {/* Les autres sections */}
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Text style={styles.menuText}>Certifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Text style={styles.menuText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Text style={styles.menuText}>Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Text style={styles.menuText}>Invite Friend</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
