import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../constants/design";

const WordCard = ({ wordData, isFavorite, onToggleFavorite }: any) => (
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
        "{wordData.example}"
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    paddingBottom: 16,
  },
  word: {
    ...typography.title,
    color: colors.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 8,
  },
  sectionContent: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  example: {
    fontStyle: "italic",
    color: colors.secondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
});

export default WordCard;
