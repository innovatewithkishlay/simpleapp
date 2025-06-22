import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const koushikImage = require("./assets/images/koushik.jpeg");

export default function App() {
  const [response, setResponse] = useState<"pending" | "accepted" | "rejected">(
    "pending"
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {response === "pending" ? (
        <RequestScreen onResponse={setResponse} />
      ) : response === "accepted" ? (
        <AcceptedScreen />
      ) : (
        <RejectedScreen onAccept={() => setResponse("accepted")} />
      )}
    </SafeAreaView>
  );
}

const RequestScreen = ({
  onResponse,
}: {
  onResponse: (res: "accepted" | "rejected") => void;
}) => (
  <View style={styles.card}>
    <Image source={koushikImage} style={styles.avatar} />
    <Text style={styles.name}>Koushik</Text>
    <Text style={styles.description}>
      You are incredibly talented at Data Structures and Algorithms!{"\n"}
      Please, would you teach me? I really want to learn from you.
    </Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={() => onResponse("accepted")}
      >
        <Text style={styles.buttonText}>Please Teach Me 🙏</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => onResponse("rejected")}
      >
        <Text style={styles.buttonText}>No, Sorry</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const AcceptedScreen = () => (
  <View style={styles.card}>
    <Image source={koushikImage} style={styles.avatar} />
    <Text style={styles.name}>Yay! Thank You!</Text>
    <Text style={styles.description}>
      I&apos;m so happy you&apos;ll teach me DSA!{"\n"}
      Can&apos;t wait to start learning from you. 😊
    </Text>
    <Text style={styles.emoji}>🎉🤩</Text>
  </View>
);

const RejectedScreen = ({ onAccept }: { onAccept: () => void }) => (
  <View style={styles.card}>
    <Image source={koushikImage} style={[styles.avatar, { opacity: 0.7 }]} />
    <Text style={[styles.name, { color: "#555" }]}>Oh no! 😢</Text>
    <Text style={styles.description}>
      I&apos;m really eager to learn from you, Koushik.{"\n"}
      Please reconsider teaching me DSA!
    </Text>
    <Text style={styles.emoji}>😭</Text>
    <TouchableOpacity
      style={[styles.button, styles.primaryButton]}
      onPress={onAccept}
    >
      <Text style={styles.buttonText}>Okay, I&apos;ll Teach You!</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    width: "100%",
    maxWidth: 400,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0D8ABC",
    resizeMode: "cover",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D8ABC",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0D8ABC",
  },
  secondaryButton: {
    backgroundColor: "#E1E5E9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emoji: {
    fontSize: 40,
    marginTop: 20,
  },
});
