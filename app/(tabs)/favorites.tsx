import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
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

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Your Favorite Words</Text>
      <Text style={styles.headerSubtitle}>
        All the words you’ve saved for quick reference.
      </Text>
    </View>
  );

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
            ListHeaderComponent={ListHeader}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.favoriteCard,
                  pressed && styles.cardPressed,
                ]}
                android_ripple={{ color: "#e0e7ff" }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.favoriteWord}>{item.word}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFavorite(item.word)}
                  >
                    <Ionicons name="close" size={22} color={colors.gray} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.favoriteMeaning} numberOfLines={3}>
                  {item.meaning}
                </Text>
              </Pressable>
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
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.title,
    color: colors.primary,
    fontSize: 22,
    marginBottom: 2,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.gray,
    fontSize: 15,
    marginBottom: 10,
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
    paddingTop: 0,
    paddingBottom: 32,
    gap: 12,
  },
  favoriteCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#2C6BED",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  cardPressed: {
    backgroundColor: "#F0F7FF",
    shadowOpacity: 0.15,
    elevation: 10,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  favoriteWord: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 2,
  },
  favoriteMeaning: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    fontSize: 16,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
