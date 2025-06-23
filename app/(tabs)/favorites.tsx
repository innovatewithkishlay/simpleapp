import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../../constants/design";
export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem("@favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={styles.header}>
        <Text style={styles.headerSubtitle}>
          Your saved words ({favorites.length})
        </Text>
      </View> */}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="book-outline" size={48} color={colors.secondary} />
          </View>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Search for words and add them to your favorites
          </Text>
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.word}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.favoriteCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.favoriteWord}>{item.word}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFavorite(item.word)}
                  >
                    <Ionicons name="close" size={24} color={colors.gray} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.favoriteMeaning} numberOfLines={3}>
                  {item.meaning}
                </Text>
              </View>
            )}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  headerTitle: {
    ...typography.title,
    color: colors.primary,
    fontSize: 24,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.gray,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8FAFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    textAlign: "center",
    maxWidth: 300,
  },
  listContainer: {
    padding: 24,
    paddingTop: 16,
  },
  favoriteCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  favoriteWord: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: "700",
  },
  favoriteMeaning: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
