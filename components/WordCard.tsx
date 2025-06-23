import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
}: WordCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.word}>{wordData.word}</Text>
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
      <Text style={styles.example}>{`\u201C${wordData.example}\u201D`}</Text>
    </View>

    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.sectionTitle}>Synonyms</Text>
        <View style={styles.tagContainer}>
          {wordData.synonyms.slice(0, 4).map((syn, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{syn}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.column}>
        <Text style={styles.sectionTitle}>Antonyms</Text>
        <View style={styles.tagContainer}>
          {wordData.antonyms.slice(0, 4).map((ant, index) => (
            <View key={index} style={[styles.tag, styles.antonymTag]}>
              <Text style={styles.tagText}>{ant}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mini Story</Text>
      <Text style={styles.sectionContent}>{wordData.story}</Text>
    </View>
  </View>
);

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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    paddingBottom: 24,
  },
  word: {
    ...typography.title,
    color: colors.primary,
    letterSpacing: -0.8,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  sectionContent: {
    ...typography.body,
    color: colors.text,
  },
  example: {
    ...typography.body,
    color: colors.secondary,
    fontStyle: "italic",
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  column: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  antonymTag: {
    backgroundColor: "#FCE7F3",
  },
  tagText: {
    ...typography.caption,
    color: colors.text,
  },
});

export default WordCard;
