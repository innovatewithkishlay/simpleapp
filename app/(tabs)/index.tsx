import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/design";

import { SafeAreaView } from "react-native-safe-area-context";
import LoadingShimmer from "../../components/LoadingShimmer";
import SearchHeader from "../../components/SearchHeader";
import WordCard from "../../components/WordCard";
import { fetchWordData } from "../../utils/api";
export default function DictionaryScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordData, setWordData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem("@favorites");
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (wordData && favorites.some((fav) => fav.word === wordData.word)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [wordData, favorites]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    animation.setValue(0);

    setIsLoading(true);
    try {
      const data = await fetchWordData(searchTerm.trim());
      setWordData(data);

      Animated.timing(animation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!wordData) return;

    try {
      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = favorites.filter(
          (fav) => fav.word !== wordData.word
        );
      } else {
        updatedFavorites = [...favorites, wordData];
      }

      await AsyncStorage.setItem(
        "@favorites",
        JSON.stringify(updatedFavorites)
      );
      setFavorites(updatedFavorites);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  const cardScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <SearchHeader
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          containerStyle={styles.searchContainer}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <LoadingShimmer />
          ) : wordData ? (
            <Animated.View
              style={[
                styles.cardAnimation,
                { transform: [{ scale: cardScale }] },
              ]}
            >
              <WordCard
                wordData={wordData}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </Animated.View>
          ) : (
            <View style={styles.placeholder}>
              <View style={styles.placeholderIcon}>
                <Text style={styles.icon}>📚</Text>
              </View>
              <Text style={styles.placeholderTitle}>Explore Words</Text>
              <Text style={styles.placeholderText}>
                Search any word to discover its definition, usage examples, and
                pronunciation
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#0A0A0A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6C757D",
    marginTop: -4,
  },
  searchContainer: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  content: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 80,
  },
  cardAnimation: {
    opacity: 1,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 40,
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#EFF2F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
    textAlign: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
});
