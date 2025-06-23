import { Ionicons } from "@expo/vector-icons";
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
import { colors, typography } from "../../constants/design";

export default function PronunciationScreen() {
  const [currentWord, setCurrentWord] = useState("Ephemeral");
  const [phonetic, setPhonetic] = useState("/ɪˈfem.ər.əl/");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  const words = [
    {
      word: "Ephemeral",
      phonetic: "/ɪˈfem.ər.əl/",
      meaning: "Lasting for a very short time",
    },
    {
      word: "Quinoa",
      phonetic: "/ˈkiːn.wɑː/",
      meaning: "Edible grain-like crop",
    },
    {
      word: "Worcestershire",
      phonetic: "/ˈwʊs.tə.ʃə/",
      meaning: "Type of sauce",
    },
    { word: "Anemone", phonetic: "/əˈnem.ə.ni/", meaning: "Flowering plant" },
    { word: "Squirrel", phonetic: "/ˈskwɜː.rəl/", meaning: "Small rodent" },
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

  const speakWord = () => {
    Speech.speak(currentWord, {
      language: "en-US",
      rate: 0.8,
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
        setUserProgress((prev) => Math.min(prev + 20, 100));
        setRecording(null);
      }
    } catch (err) {
      alert("Could not stop recording. Please try again.");
    }
  };

  const playRecording = async () => {
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

  const nextWord = () => {
    const currentIndex = words.findIndex((w) => w.word === currentWord);
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentWord(words[nextIndex].word);
    setPhonetic(words[nextIndex].phonetic);
    setRecordedUri(null);
    setUserProgress(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pronunciation Practice</Text>
        <Text style={styles.subtitle}>Overcome your speaking fears</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.word}>{currentWord}</Text>
        <Text style={styles.phonetic}>{phonetic}</Text>

        <TouchableOpacity style={styles.playButton} onPress={speakWord}>
          <Ionicons name="volume-high" size={28} color="white" />
          <Text style={styles.buttonText}>Hear Pronunciation</Text>
        </TouchableOpacity>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>How to practice:</Text>
          <Text style={styles.instructionText}>
            1. Listen to the pronunciation
          </Text>
          <Text style={styles.instructionText}>
            2. Record yourself saying it
          </Text>
          <Text style={styles.instructionText}>
            3. Listen to your recording and repeat
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recording,
              { flex: 1 },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isPlaying}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={28}
              color="white"
            />
            <Text style={styles.buttonText}>
              {isRecording ? "Stop Recording" : "Record Your Voice"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.playUserButton,
              { flex: 1, opacity: recordedUri ? 1 : 0.5 },
            ]}
            onPress={playRecording}
            disabled={!recordedUri || isPlaying}
          >
            {isPlaying ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="play" size={28} color="white" />
                <Text style={styles.buttonText}>Play Your Recording</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Your Progress: {userProgress}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${userProgress}%` }]}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextWord}>
        <Text style={styles.nextButtonText}>Next Word</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.tipContainer}>
        <Ionicons name="bulb-outline" size={24} color={colors.accent} />
        <Text style={styles.tipText}>
          Tip: Practice daily for 5 minutes to see significant improvement in 30
          days!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    fontSize: 26,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  word: {
    ...typography.title,
    color: colors.primary,
    fontSize: 32,
    textAlign: "center",
    marginBottom: 8,
  },
  phonetic: {
    ...typography.body,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 32,
    fontSize: 18,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  recordButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 0,
  },
  recording: {
    backgroundColor: "#E74C3C",
  },
  playUserButton: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 0,
  },
  buttonText: {
    ...typography.button,
    color: "white",
  },
  instructionCard: {
    backgroundColor: "#F0F7FF",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginTop: 16,
  },
  instructionTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: 12,
  },
  instructionText: {
    ...typography.body,
    color: colors.text,
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 32,
  },
  progressText: {
    ...typography.body,
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#EDF2F7",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: 6,
  },
  nextButton: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  tipContainer: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 16,
  },
  tipText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
});
