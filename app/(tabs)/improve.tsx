import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../../constants/design";
import { improveSentence } from "../../utils/api";

export default function ImproveScreen() {
  const [sentence, setSentence] = useState("");
  const [improvedSentence, setImprovedSentence] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImprove = async () => {
    if (!sentence.trim()) return;

    setIsLoading(true);
    try {
      const improved = await improveSentence(sentence);
      setImprovedSentence(improved);
    } catch (error) {
      console.error("Improvement failed:", error);
      setImprovedSentence("Couldn't improve this sentence. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    // Implement copy to clipboard
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="auto-awesome" size={28} color={colors.primary} />
        <Text style={styles.title}>Enhance Your Writing</Text>
      </View>

      <Text style={styles.label}>Enter your sentence:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a sentence to improve..."
        placeholderTextColor={colors.gray}
        value={sentence}
        onChangeText={setSentence}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleImprove}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Improve Sentence</Text>
        )}
      </TouchableOpacity>

      {improvedSentence ? (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Enhanced Version</Text>
            <TouchableOpacity onPress={handleCopy}>
              <MaterialIcons
                name="content-copy"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{improvedSentence}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    marginLeft: 12,
  },
  label: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    ...typography.subtitle,
    color: "white",
  },
  resultContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    ...typography.subtitle,
    color: colors.primary,
  },
  resultBox: {
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  resultText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
});
