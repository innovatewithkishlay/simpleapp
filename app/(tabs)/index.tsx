import React from "react";
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const handleRequest = () => {
    Alert.alert(
      "Request Sent!",
      "Your request for Koushik to teach you DSA has been sent. Fingers crossed!"
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://ui-avatars.com/api/?name=Koushik&background=0D8ABC&color=fff&size=128",
          }}
          style={styles.avatar}
        />
        <Text style={styles.header}>Request to Koushik</Text>
        <Text style={styles.body}>Hi Koushik,</Text>
        <Text style={styles.body}>
          I truly admire your intelligence and professionalism in Data
          Structures and Algorithms. Your teaching inspires so many people!
        </Text>
        <Text style={styles.body}>
          Would you please consider teaching me DSA? I am eager to learn from
          you and believe your guidance will help me grow as a programmer.
        </Text>
        <Text style={styles.footer}>Looking forward to your mentorship!</Text>
        <TouchableOpacity style={styles.button} onPress={handleRequest}>
          <Text style={styles.buttonText}>Send Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#0D8ABC",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D8ABC",
    marginBottom: 16,
    textAlign: "center",
  },
  body: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },
  footer: {
    fontSize: 16,
    color: "#0D8ABC",
    fontStyle: "italic",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0D8ABC",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
