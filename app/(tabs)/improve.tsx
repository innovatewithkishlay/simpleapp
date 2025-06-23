import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../../constants/design";
import { improveSentence } from "../../utils/api";

export default function ImproveScreen() {
  const [sentence, setSentence] = useState("");
  const [improvedSentence, setImprovedSentence] = useState("");
  const [improvementDetails, setImprovementDetails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImprove = async () => {
    if (!sentence.trim()) return;

    setIsLoading(true);
    try {
      const { improved, improvements } = await improveSentence(sentence);
      setImprovedSentence(improved);
      setImprovementDetails(improvements);
    } catch (error) {
      console.error("Improvement failed:", error);
      setImprovedSentence("Couldn't improve this sentence. Please try again.");
      setImprovementDetails(["General improvement"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (improvedSentence) {
      await Clipboard.setStringAsync(improvedSentence);
    }
  };

  const getImprovementLabel = (detail: string) => {
    const mapping: Record<string, string> = {
      vocabulary: "Vocabulary Enhanced",
      grammar: "Grammar Corrected",
      style: "Style Improved",
      clarity: "Clarity Improved",
      conciseness: "More Concise",
      tone: "Tone Adjusted",
      other: "General Improvement",
    };
    return mapping[detail.toLowerCase()] || detail;
  };

  const getImprovementMeta = (detail: string) => {
    const lowerDetail = detail.toLowerCase();

    if (lowerDetail.includes("vocabulary") || lowerDetail === "vocabulary") {
      return { icon: "auto-stories", color: colors.secondary };
    }
    if (lowerDetail.includes("grammar") || lowerDetail === "grammar") {
      return { icon: "spellcheck", color: colors.success };
    }
    if (lowerDetail.includes("style") || lowerDetail === "style") {
      return { icon: "brush", color: colors.primary };
    }
    if (lowerDetail.includes("clarity") || lowerDetail === "clarity") {
      return { icon: "visibility", color: "#3498DB" };
    }
    return { icon: "check-circle", color: colors.gray };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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

            <View style={styles.improvementDetails}>
              <Text style={styles.improvementTitle}>What was improved:</Text>
              <View style={styles.badgeContainer}>
                {improvementDetails.map((detail, idx) => {
                  const label = getImprovementLabel(detail);
                  const { icon, color } = getImprovementMeta(detail);

                  return (
                    <View
                      key={idx}
                      style={[styles.improvementBadge, { borderColor: color }]}
                    >
                      <MaterialIcons
                        name={icon as any}
                        size={18}
                        color={color}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.improvementBadgeText, { color }]}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultText}>{improvedSentence}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: colors.background,
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
    borderRadius: 16,
    padding: 20,
    minHeight: 150,
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    ...typography.button,
    color: "white",
  },
  resultContainer: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  resultTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.primary,
  },
  improvementDetails: {
    marginBottom: 20,
  },
  improvementTitle: {
    ...typography.subtitle,
    color: colors.secondary,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  improvementBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  improvementBadgeText: {
    ...typography.caption,
    fontWeight: "600",
  },
  resultBox: {
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  resultText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
    fontSize: 17,
  },
});
