import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchWordData, improveSentence } from "../../utils/api";

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordData, setWordData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentence, setSentence] = useState("");
  const [improvedSentence, setImprovedSentence] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem("@favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
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
      setImprovedSentence("");
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImproveSentence = async () => {
    if (!sentence.trim()) return;

    setIsLoading(true);
    try {
      const improved = await improveSentence(sentence);
      setImprovedSentence(improved);
    } catch (error) {
      console.error("Improvement failed:", error);
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a word"
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
        />
        <Button title="Search" onPress={handleSearch} disabled={isLoading} />
      </View>

      {isLoading && <ActivityIndicator size="large" color="#4A90E2" />}

      {wordData && (
        <View style={styles.wordCard}>
          <View style={styles.wordHeader}>
            <Text style={styles.wordTitle}>{wordData.word}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#E74C3C" : "#95A5A6"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Meaning:</Text>
          <Text style={styles.content}>{wordData.meaning}</Text>

          <Text style={styles.sectionTitle}>Example:</Text>
          <Text style={styles.content}>{wordData.example}</Text>

          <Text style={styles.sectionTitle}>Synonyms:</Text>
          <Text style={styles.content}>{wordData.synonyms.join(", ")}</Text>

          <Text style={styles.sectionTitle}>Antonyms:</Text>
          <Text style={styles.content}>{wordData.antonyms.join(", ")}</Text>

          <Text style={styles.sectionTitle}>Mini Story:</Text>
          <Text style={styles.content}>{wordData.story}</Text>
        </View>
      )}

      <View style={styles.improveContainer}>
        <Text style={styles.sectionTitle}>Improve My Sentence:</Text>
        <TextInput
          style={[styles.input, styles.sentenceInput]}
          placeholder="Type a sentence to improve"
          value={sentence}
          onChangeText={setSentence}
          multiline
        />
        <Button
          title="Improve Sentence"
          onPress={handleImproveSentence}
          disabled={isLoading}
        />

        {improvedSentence ? (
          <View style={styles.improvedResult}>
            <Text style={styles.improvedLabel}>Improved:</Text>
            <Text style={styles.improvedText}>{improvedSentence}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ECF0F1",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: "#FFF",
  },
  sentenceInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  wordCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  wordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3498DB",
    marginTop: 15,
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: "#34495E",
    lineHeight: 24,
  },
  improveContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  improvedResult: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2ECC71",
  },
  improvedLabel: {
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 5,
  },
  improvedText: {
    fontSize: 16,
    color: "#34495E",
  },
});
