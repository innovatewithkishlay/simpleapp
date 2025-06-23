import { Ionicons } from "@expo/vector-icons";
import Voice from "@react-native-community/voice";
import * as Speech from "expo-speech"; // Add expo-speech
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "../constants/design";

const SearchHeader = ({ value, onChange, onSearch }: any) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state

  // Initialize voice recognition
  useEffect(() => {
    const initVoice = async () => {
      try {
        await Voice.destroy();
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);
      } catch (error) {
        console.error("Voice initialization failed:", error);
      }
    };

    initVoice();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (event: any) => {
    if (event.value?.[0]) {
      onChange(event.value[0]);
      onSearch();
    }
    stopListening();
  };

  const onSpeechError = (event: any) => {
    console.error("Speech error:", event.error);
    Alert.alert(
      "Voice Error",
      event.error?.message || "Voice recognition failed"
    );
    stopListening();
  };

  const startListening = async () => {
    try {
      await Voice.start("en-IN");
    } catch (error) {
      console.error("Start listening error:", error);
      Alert.alert(
        "Microphone Error",
        "Could not access microphone. Please check permissions."
      );
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error("Stop listening error:", error);
    } finally {
      setIsListening(false);
    }
  };

  // Add speech synthesis for feedback
  const speakFeedback = (message: string) => {
    Speech.speak(message, {
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onError: (error) => console.error("Speech error:", error),
    });
  };

  const handleVoicePress = async () => {
    if (isListening) {
      await stopListening();
      speakFeedback("Listening stopped");
    } else {
      await startListening();
      speakFeedback("Listening... Speak now");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.gray}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search any word..."
          placeholderTextColor={colors.gray}
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {value ? (
          <TouchableOpacity
            onPress={() => onChange("")}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={20} color={colors.gray} />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.voiceButton,
          isListening && styles.voiceButtonActive,
          isSpeaking && styles.voiceButtonSpeaking,
        ]}
        onPress={handleVoicePress}
        disabled={isSpeaking}
      >
        <Ionicons
          name={isSpeaking ? "volume-high" : isListening ? "mic-off" : "mic"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearch}
        disabled={isSpeaking}
      >
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
    paddingTop: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  input: {
    flex: 1,
    height: "100%",
    ...typography.body,
    color: colors.text,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  voiceButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: "#8E44AD",
  },
  voiceButtonSpeaking: {
    backgroundColor: "#3498DB",
  },
  searchButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default SearchHeader;
