import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import LoadingShimmer from "../../components/LoadingShimmer";
import SearchHeader from "../../components/SearchHeader";
import WordCard from "../../components/WordCard";
import { colors } from "../../constants/design";
import { fetchWordData } from "../../utils/api";

export default function DictionaryScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordData, setWordData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

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

    setIsLoading(true);
    try {
      const data = await fetchWordData(searchTerm.trim());
      setWordData(data);
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

  return (
    <View style={styles.container}>
      <SearchHeader
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <LoadingShimmer />
        ) : wordData ? (
          <WordCard
            wordData={wordData}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Search any word to see its definition, examples, and more
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  placeholderText: {
    fontSize: 18,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 28,
  },
});
