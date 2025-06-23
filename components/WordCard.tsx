import { Ionicons } from "@expo/vector-icons";
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    paddingBottom: 16,
  } as ViewStyle,

  word: {
    ...typography.title,
    color: colors.primary,
  } as TextStyle,

  section: {
    marginBottom: 20,
  } as ViewStyle,

  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 8,
  } as TextStyle,

  sectionContent: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  } as TextStyle,

  example: {
    fontStyle: "italic",
    color: colors.secondary,
  } as TextStyle,

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as ViewStyle,

  column: {
    width: "48%",
  } as ViewStyle,
});

const WordCard = ({
  wordData,
  isFavorite,
  onToggleFavorite,
}: WordCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.word}>{wordData.word}</Text>
      <TouchableOpacity onPress={onToggleFavorite}>
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

export default WordCard;
