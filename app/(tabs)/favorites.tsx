import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem("@favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (word: string) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.word !== word);
      await AsyncStorage.setItem(
        "@favorites",
        JSON.stringify(updatedFavorites)
      );
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={60} color="#BDC3C7" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Search for words and add them to favorites
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.favoriteCard}>
              <Text style={styles.favoriteWord}>{item.word}</Text>
              <Text style={styles.favoriteMeaning} numberOfLines={2}>
                {item.meaning}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(item.word)}
              >
                <Ionicons name="trash-outline" size={20} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#7F8C8D",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#95A5A6",
    textAlign: "center",
    marginTop: 10,
  },
  listContainer: {
    padding: 20,
  },
  favoriteCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  favoriteWord: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  favoriteMeaning: {
    fontSize: 16,
    color: "#7F8C8D",
    lineHeight: 22,
  },
  removeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
