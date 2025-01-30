import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const formations = [
  { id: "1", title: "FullStack Spring Angular DEVOPS", date: "25 JAN", image: { uri: "https://sip-academy.com/uploads/formation/BootCamp%20%20%20Spring%20Angular%20%20&%20%20Devops%20370%20x%20250%20px)%20%20(2)-6782364ed1299.png" } },
  { id: "2", title: "Certifications CKA & CKAD", date: "10 FÉV", image: { uri: "https://sip-academy.com/uploads/formation/Pr%C3%A9paration%20aux%20certifications%20%20%20CKA%20et%20CKAD%20%20370%C2%A0%C3%97%C2%A0250%C2%A0px%20v2%20%20(1)%20(2)-674790afc49af.png" } },
  { id: "3", title: "FullStack Spring Angular Mobile", date: "5 MARS", image: { uri: "https://sip-academy.com/uploads/formation/FullStack%20Web%20&%20Mobile%20Spring%20Boot%20Angular%20&%20Reat%20Native%20(370%20x%20250%20px)-66caec46287d8.png" } },
];

const sessions = [
    { id: "1", title: "BootCamp Spring Angular & DevOps", datedebut: "25-01 09:00", datefin: "25-01 16:00", mode: "En ligne/Présentiel", image: { uri: "https://sip-academy.com/uploads/formation/BootCamp%20%20%20Spring%20Angular%20%20&%20%20Devops%20370%20x%20250%20px)%20%20(2)-6782364ed1299.png" } },
 
    { id: "2", title: "Préparation aux certifications CKA et CKAD", datedebut: "25-01 09:00", datefin: "25-01 16:00", mode: "En ligne/Présentiel", image: { uri: "https://sip-academy.com/uploads/evenement/Pr%C3%A9paration%20aux%20certifications%20%20%20CKA%20et%20CKAD%20%20370%C2%A0%C3%97%C2%A0250%C2%A0px%20v2%20%20(1)%20(2)-67479309964a2.png" } },
    { id: "3", title: "Java OCP 17", datedebut: "25-01 09:00", datefin: "25-01 16:00", mode: "En ligne/Présentiel", image: { uri: "https://sip-academy.com/uploads/evenement/OCP%2017_petite_taille-67314786cbaea.png" } },

];
const actualites = [
    { id: "1", title: "Certification Mariem Ben ARFI Java OCA 8", date: "15 JAN 2025", image: { uri: "https://sip-academy.com/uploads/actualite/OCA%20370-643b16d3c4721.png" } },
  
    { id: "2", title: "Certification Mohamed Ali Chakroun OCP11", date: "10 Apr 2023", image: { uri: "https://sip-academy.com/uploads/actualite/OCP%20%20370-643b16b1efd0a.png" } },
    { id: "3", title: "Certification Safa Mejdoub Java OCA", date: "10 Apr 2023", image: { uri: "https://sip-academy.com/uploads/actualite/OCA%20370-643b16d3c4721.png" } },


];
const sections = [
  { title: "Formations", data: formations },
  { title: "Sessions", data: sessions },
  { title: "Actualités", data: actualites },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const renderActualiteItem = ({ item }) => (
    <View style={styles.actualiteItem}>
      <Image source={item.image} style={styles.actualiteImage} />
      <View style={styles.overlayDate}>
        <Text style={styles.actualiteDate}>{item.date}</Text>
      </View>
      <View style={styles.actualiteContent}>
        <Text style={styles.actualiteTitle}>{item.title}</Text>
      </View>
    </View>
  );
  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionItem}>
      <Image source={item.image} style={styles.sessionImage} />
   
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionTime}>{item.datedebut} - {item.datefin}</Text>
        <Text style={styles.sessionMode}>{item.mode}</Text>
      </View>
    </View>
  );
  const renderSection = (title, data) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>VOIR TOUT &gt;</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={
          title === "Sessions"
            ? renderSessionItem
            : title === "Actualités"
            ? renderActualiteItem
            : ({ item }) => (
                <View style={styles.item}>
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.overlayDate}>
                    <Text style={styles.itemDate}>{item.date}</Text>
                  </View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                </View>
              )
        }
        keyExtractor={(item) => `${title}-${item.id}`}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <Image source={{ uri: "https://sip-academy.com/uploads/icon/SIPFront-6437228815aa3.png" }} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sections */}
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}> {/* Ajout de padding pour éviter la superposition */}
        {sections.map(({ title, data }) => renderSection(title, data))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  fixedHeader: { flexDirection: "row", justifyContent: "space-between", padding: 10, alignItems: "center", backgroundColor: "white", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 },
  scrollContent: { paddingTop: 60 },
  logo: { width: 150, height: 40, resizeMode: "contain" },
  section: { marginVertical: 20, paddingHorizontal: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { fontSize: 10, color: "#203a72", fontWeight: "bold" },
  item: { marginRight: 15, borderRadius: 10, overflow: "hidden", backgroundColor: "#eee", width: 310, height: 200 },
  itemImage: { width: "100%", height: "100%", borderRadius: 10 },
  overlayDate: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 6, borderRadius: 8 },
  itemDate: { color: "white", fontSize: 14, fontWeight: "bold" },
  titleContainer: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, alignItems: "center" },
  itemTitle: { color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  sessionItem: { marginRight: 15, borderRadius: 10, overflow: "hidden", backgroundColor: "#eee", width: 310, height: 240 },
  sessionImage: { width: "100%", height: "60%", borderRadius: 10 },
  sessionOverlay: { position: "absolute", top: 10, left: 10, backgroundColor: "#203a72", padding: 8, borderRadius: 8 },
  sessionDate: { color: "white", fontSize: 14, fontWeight: "bold" },
  sessionInfo: { padding: 10, alignItems: "center", backgroundColor: "#f5f5f5", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  sessionTitle: { color: "#203a72", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  sessionTime: { fontSize: 14, color: "#757575", marginTop: 5 },
  sessionMode: { fontSize: 14, color: "#424242", fontWeight: "bold" },
  actualiteItem: { marginRight: 15, borderRadius: 10, overflow: "hidden", backgroundColor: "#eee", width: 310, height: 300 },
  actualiteImage: { width: "100%", height: "75%", borderRadius: 10 },
  overlayDate: { position: "absolute", top: 10, left: 10, backgroundColor: "#203a72", padding: 8, borderRadius: 8 },
  actualiteDate: { color: "white", fontSize: 14, fontWeight: "bold" },
  actualiteContent: { padding: 10, alignItems: "center", backgroundColor: "#f5f5f5", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  actualiteTitle: { color: "#203a72", fontSize: 16, fontWeight: "bold", textAlign: "center" },
});

export default HomeScreen;