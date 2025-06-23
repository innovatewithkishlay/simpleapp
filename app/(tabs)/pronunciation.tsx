import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "../../constants/design";

const generateParagraph = async (topic: string) => {
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
                "Generate a paragraph in simple English for Indian students to practice pronunciation. Use common Indian vocabulary and sentence structures. Use short sentences. Do not add any notes, only the paragraph.",
            },
            {
              role: "user",
              content: `Create a 3-sentence paragraph about ${topic} using simple Indian English. Focus on clear pronunciation, everyday words, and natural flow.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      }
    );

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    return "Children go to school every day. They learn reading and writing. Teachers help students understand new things.";
  }
};

export default function PronunciationScreen() {
  const [currentParagraph, setCurrentParagraph] = useState(
    "Children go to school every day. They learn reading and writing. Teachers help students understand new things."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("School");
  const topics = [
    "School",
    "Morning routine",
    "Family",
    "Cricket",
    "Market",
    "Rainy day",
    "Festivals",
    "Friends",
  ];

  React.useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  const playModelReading = (slow = false) => {
    setIsModelSpeaking(true);
    Speech.speak(currentParagraph, {
      language: "en-IN",
      rate: slow ? 0.5 : 0.75,
      pitch: 1.0,
      onDone: () => setIsModelSpeaking(false),
      onStopped: () => setIsModelSpeaking(false),
    });
  };
  const stopModelReading = () => {
    Speech.stop();
    setIsModelSpeaking(false);
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

  const generateNewParagraph = async () => {
    setIsGenerating(true);
    try {
      const newParagraph = await generateParagraph(currentTopic);
      setCurrentParagraph(newParagraph);
      setRecordedUri(null);
    } catch (error) {
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialIcons
            name="record-voice-over"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.title}>Practice Pronunciation</Text>
          <Text style={styles.subtitle}>Practice clear, everyday English</Text>
        </View>

        <View style={styles.practiceCard}>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>{currentParagraph}</Text>
            <View style={styles.pronunciationGuide}>
              <Ionicons name="megaphone" size={20} color={colors.primary} />
              <Text style={styles.guideText}>
                Listen carefully. Speak slowly and clearly. Focus on each word.
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={
                isModelSpeaking
                  ? stopModelReading
                  : () => playModelReading(false)
              }
            >
              <Ionicons
                name={isModelSpeaking ? "stop-circle" : "play-circle"}
                size={32}
                color={colors.primary}
              />
              <Text style={styles.controlText}>
                {isModelSpeaking ? "Stop" : "Listen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: "#8E44AD" }]}
              onPress={() => playModelReading(true)}
              disabled={isModelSpeaking}
            >
              <Ionicons name="speedometer" size={28} color="white" />
              <Text style={[styles.controlText, { color: "white" }]}>Slow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name={isRecording ? "stop-circle" : "mic-circle"}
                size={32}
                color={colors.secondary}
              />
              <Text style={styles.controlText}>
                {isRecording ? "Stop" : "Record"}
              </Text>
            </TouchableOpacity>
            {recordedUri && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={playUserRecording}
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <ActivityIndicator size="small" color={colors.success} />
                ) : (
                  <Ionicons
                    name="play-circle"
                    size={32}
                    color={colors.success}
                  />
                )}
                <Text style={styles.controlText}>
                  {isPlaying ? "Playing" : "Playback"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.topicContainer}>
          <Text style={styles.sectionTitle}>Practice Topics</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic}
                style={[
                  styles.topicButton,
                  currentTopic === topic && styles.topicButtonActive,
                ]}
                onPress={() => setCurrentTopic(topic)}
              >
                <Text
                  style={[
                    styles.topicText,
                    currentTopic === topic && styles.topicTextActive,
                  ]}
                >
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateNewParagraph}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.generateButtonText}>
                New Practice Paragraph
              </Text>
            </>
          )}
        </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    fontSize: 26,
    marginTop: 12,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    marginTop: 4,
    textAlign: "center",
  },
  practiceCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  paragraphContainer: {
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  paragraph: {
    ...typography.body,
    color: colors.text,
    lineHeight: 28,
    fontSize: 18,
    textAlign: "center",
  },
  pronunciationGuide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  guideText: {
    ...typography.caption,
    color: colors.primary,
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  controlButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#F0F4F8",
    minWidth: 80,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  controlText: {
    ...typography.caption,
    color: colors.text,
    marginTop: 8,
  },
  topicContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 12,
  },
  topicButton: {
    backgroundColor: "#F0F4F8",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
  },
  topicButtonActive: {
    backgroundColor: colors.primary,
  },
  topicText: {
    ...typography.body,
    color: colors.text,
  },
  topicTextActive: {
    color: "white",
    fontWeight: "700",
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  generateButtonText: {
    ...typography.button,
    color: "white",
  },
});
