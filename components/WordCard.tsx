import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors, typography } from "../constants/design";

type WordCardProps = {
  wordData: {
    word: string;
    meaning: string;
    example: string;
    synonyms: string[];
    antonyms: string[];
    story: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const WordCard = ({
  wordData,
  isFavorite,
  onToggleFavorite,
}: WordCardProps) => {
  const handleSpeak = () => {
    if (wordData.word) {
      Speech.speak(wordData.word, {
        language: "en-US",
        rate: 0.9,
        pitch: 1.1,
      });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{wordData.word}</Text>
          <TouchableOpacity onPress={handleSpeak} style={styles.speakerButton}>
            <Ionicons name="volume-high" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? colors.secondary : colors.gray}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Definition</Text>
        <Text style={styles.sectionContent}>{wordData.meaning}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Example</Text>
        <Text style={[styles.sectionContent, styles.example]}>
          {`\u201C${wordData.example}\u201D`}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Synonyms</Text>
          <Text style={styles.sectionContent}>
            {wordData.synonyms.join(", ")}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Antonyms</Text>
          <Text style={styles.sectionContent}>
            {wordData.antonyms.join(", ")}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mini Story</Text>
        <Text style={styles.sectionContent}>{wordData.story}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  } as ViewStyle,

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    paddingBottom: 24,
  } as ViewStyle,

  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  } as ViewStyle,

  word: {
    ...typography.title,
    color: colors.primary,
    letterSpacing: -0.8,
  } as TextStyle,

  speakerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
  } as ViewStyle,

  section: {
    marginBottom: 24,
  } as ViewStyle,

  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 0.2,
  } as TextStyle,

  sectionContent: {
    ...typography.body,
    color: colors.text,
  } as TextStyle,

  example: {
    ...typography.body,
    color: colors.secondary,
    fontStyle: "italic",
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  } as TextStyle,

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  } as ViewStyle,

  column: {
    flex: 1,
  } as ViewStyle,
});

export default WordCard;
