import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Charger les données du panier depuis AsyncStorage
  const loadCartData = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cartItems");
      if (savedCart !== null) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        calculateTotal(parsedCart);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du panier", error);
    }
  };

  // Calculer le total
  const calculateTotal = (items) => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  // Supprimer un article du panier
  const removeItem = async (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);

    // Sauvegarder la nouvelle liste dans AsyncStorage
    try {
      await AsyncStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article", error);
    }
  };

  // Ajouter un article au panier
  const addItem = async (item) => {
    const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      await AsyncStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  };

  // Effacer le panier
  const clearCart = async () => {
    setCartItems([]);
    setTotal(0);
    try {
      await AsyncStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Erreur lors de l'effacement du panier", error);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadCartData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Panier</Text>

      {/* Liste des articles */}
      <ScrollView style={styles.scrollContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Votre panier est vide.</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                  {item.price} DT x {item.quantity}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Résumé */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{total} DT</Text>
      </View>

      {/* Boutons */}
      <View style={styles.footerButtonsContainer}>
        {/* Suppression du bouton "Continuer les achats" */}
        <TouchableOpacity
          style={[styles.footerButton, styles.checkoutButton]}
          onPress={() => Alert.alert("Passer au paiement")}
        >
          <Text style={styles.footerButtonText}>Passer au paiement</Text>
        </TouchableOpacity>
        {/* Effacer le panier */}
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={[styles.footerButton, styles.clearButton]}
            onPress={clearCart}
          >
            <Text style={styles.footerButtonText}>Vider le panier</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#203a72",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 5,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#203a72",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center", // Centrer le bouton
  },
  footerButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButton: {
    backgroundColor: "gold",
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 50,
    borderRadius: 5,
    width: "100%", // Prendre toute la largeur
  },
  clearButton: {
    backgroundColor: "red",
    marginTop: 10,
  },
  footerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});

export default CartScreen;
