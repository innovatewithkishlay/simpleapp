import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../../constants/design";

const generateParagraph = async (topic: string, difficulty: string) => {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a speech coach. Generate clear, well-structured paragraphs for pronunciation practice.",
            },
            {
              role: "user",
              content: `Generate a ${difficulty} level paragraph about ${topic}. Make it 3-4 sentences, perfect for pronunciation practice. Focus on clear articulation and natural flow.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "Technology has revolutionized the way we communicate and learn. Modern applications help people improve their speaking skills through interactive practice. Clear pronunciation is essential for effective communication in both personal and professional settings.";
  }
};

export default function PronunciationScreen() {
  const [currentParagraph, setCurrentParagraph] = useState(
    "Technology has revolutionized the way we communicate and learn. Modern applications help people improve their speaking skills through interactive practice. Clear pronunciation is essential for effective communication in both personal and professional settings."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("Technology");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const topics = [
    "Technology",
    "Health",
    "Environment",
    "Education",
    "Business",
    "Travel",
    "Science",
    "Art",
  ];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const animationValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  const generateNewParagraph = async () => {
    setIsGenerating(true);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      const newParagraph = await generateParagraph(currentTopic, difficulty);
      setCurrentParagraph(newParagraph);
      setRecordedUri(null);
    } catch (error) {
      console.error("Failed to generate paragraph:", error);
    } finally {
      setIsGenerating(false);
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const playModelReading = () => {
    Speech.speak(currentParagraph, {
      language: "en-US",
      rate: 0.85,
      pitch: 1.0,
    });
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      setIsRecording(false);
      alert("Could not start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordedUri(uri || null);
        setRecording(null);
      }
    } catch (err) {
      alert("Could not stop recording. Please try again.");
    }
  };

  const playUserRecording = async () => {
    if (!recordedUri) return;
    setIsPlaying(true);
    const { sound } = await Audio.Sound.createAsync(
      { uri: recordedUri },
      { shouldPlay: true }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        setIsPlaying(false);
        sound.unloadAsync();
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="record-voice-over"
          size={32}
          color={colors.primary}
        />
        <Text style={styles.title}>Speech Coach</Text>
        <Text style={styles.subtitle}>Master fluent pronunciation</Text>
      </View>

      <View style={styles.selectionCard}>
        <Text style={styles.selectionTitle}>Practice Settings</Text>
        <View style={styles.selectionRow}>
          <View style={styles.selectionGroup}>
            <Text style={styles.selectionLabel}>Topic</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {topics.map((topic) => (
                  <TouchableOpacity
                    key={topic}
                    style={[
                      styles.chip,
                      currentTopic === topic && styles.chipActive,
                    ]}
                    onPress={() => setCurrentTopic(topic)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        currentTopic === topic && styles.chipTextActive,
                      ]}
                    >
                      {topic}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.difficultyContainer}>
          {difficulties.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.difficultyButtonActive,
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === level && styles.difficultyTextActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View
        style={[
          styles.practiceCard,
          {
            opacity: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.7],
            }),
          },
        ]}
      >
        <View style={styles.practiceHeader}>
          <Text style={styles.practiceTitle}>Reading Passage</Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateNewParagraph}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <MaterialIcons name="refresh" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>{currentParagraph}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.modelButton}
            onPress={playModelReading}
          >
            <Ionicons name="volume-high" size={24} color="white" />
            <Text style={styles.actionButtonText}>Listen to Model</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingActive]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <MaterialIcons
              name={isRecording ? "stop" : "mic"}
              size={24}
              color="white"
            />
            <Text style={styles.actionButtonText}>
              {isRecording ? "Stop Recording" : "Practice Reading"}
            </Text>
          </TouchableOpacity>

          {recordedUri && (
            <TouchableOpacity
              style={styles.playbackButton}
              onPress={playUserRecording}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Ionicons name="play" size={24} color="white" />
              )}
              <Text style={styles.actionButtonText}>
                {isPlaying ? "Playing..." : "Hear Your Reading"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Ionicons name="bulb" size={20} color={colors.accent} />
        <Text style={styles.tipsText}>
          Focus on clear articulation, natural pauses, and smooth flow between
          words.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    fontSize: 28,
    marginTop: 12,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    marginTop: 4,
  },
  selectionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  selectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 16,
  },
  selectionRow: {
    marginBottom: 16,
  },
  selectionGroup: {
    marginBottom: 8,
  },
  selectionLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: 8,
    fontWeight: "600",
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F0F4F8",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "white",
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  difficultyButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  difficultyText: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
  },
  difficultyTextActive: {
    color: "white",
  },
  practiceCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  practiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  practiceTitle: {
    ...typography.subtitle,
    color: colors.primary,
  },
  generateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  paragraphContainer: {
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  paragraph: {
    ...typography.body,
    color: colors.text,
    lineHeight: 28,
    fontSize: 16,
  },
  actionContainer: {
    gap: 12,
  },
  modelButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  recordButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  recordingActive: {
    backgroundColor: "#E74C3C",
  },
  playbackButton: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  actionButtonText: {
    ...typography.button,
    color: "white",
  },
  tipsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 16,
  },
  tipsText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
});
