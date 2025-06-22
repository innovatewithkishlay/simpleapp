import React, { useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const koushikImage = require("../../assets/images/koushik.jpeg");

export default function App() {
  const [response, setResponse] = useState<
    "pending" | "accepted" | "rejected" | "portfolio"
  >("pending");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      {response === "pending" ? (
        <RequestScreen onResponse={setResponse} />
      ) : response === "accepted" ? (
        <AcceptedScreen onReset={() => setResponse("pending")} />
      ) : response === "rejected" ? (
        <RejectedScreen
          onAccept={() => setResponse("accepted")}
          onPortfolio={() => setResponse("portfolio")}
        />
      ) : (
        <PortfolioScreen onBack={() => setResponse("pending")} />
      )}
    </SafeAreaView>
  );
}

const RequestScreen = ({
  onResponse,
}: {
  onResponse: (res: "accepted" | "rejected") => void;
}) => (
  <View style={styles.mainContainer}>
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={koushikImage} style={styles.avatar} />
        <View style={styles.onlineIndicator} />
      </View>

      <Text style={styles.name}>Koushik</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>DSA Expert</Text>
      </View>

      <Text style={styles.description}>
        You are incredibly talented at Data Structures and Algorithms!{"\n"}I
        deeply respect your expertise and would be honored to learn from you.
      </Text>

      <View style={styles.requestBox}>
        <Text style={styles.requestText}>
          🙏 Would you please teach me DSA?
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => onResponse("accepted")}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            ✨ Yes, I&apos;ll teach you!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => onResponse("rejected")}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const AcceptedScreen = ({ onReset }: { onReset: () => void }) => (
  <View style={styles.mainContainer}>
    <View style={styles.card}>
      <View style={styles.successIcon}>
        <Text style={styles.successEmoji}>🎉</Text>
      </View>
      <Image source={koushikImage} style={styles.avatar} />
      <Text style={styles.successTitle}>Amazing! Thank You!</Text>
      <Text style={styles.description}>
        I&apos;m incredibly grateful you&apos;ll mentor me in DSA!{"\n"}
        When should we start our first session?
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={onReset}
      >
        <Text style={styles.primaryButtonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RejectedScreen = ({
  onAccept,
  onPortfolio,
}: {
  onAccept: () => void;
  onPortfolio: () => void;
}) => (
  <View style={styles.mainContainer}>
    <View style={styles.card}>
      <Image source={koushikImage} style={[styles.avatar, { opacity: 0.8 }]} />
      <Text style={styles.rejectedTitle}>I understand... 😔</Text>
      <Text style={styles.description}>
        No worries! Maybe you&apos;d like to check out my work first?{"\n"}
        I&apos;m passionate about learning and growing as a developer.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.portfolioButton]}
          onPress={onPortfolio}
        >
          <Text style={styles.portfolioButtonText}>🌐 View My Portfolio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onAccept}
        >
          <Text style={styles.primaryButtonText}>
            Actually, I&apos;ll teach you!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const PortfolioScreen = ({ onBack }: { onBack: () => void }) => {
  const openPortfolio = () => {
    Linking.openURL("https://kishlaykumar.onrender.com");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <View style={styles.portfolioHeader}>
          <Text style={styles.portfolioTitle}>My Portfolio</Text>
          <Text style={styles.portfolioSubtitle}>Full Stack Developer</Text>
        </View>

        <Text style={styles.description}>
          Explore my projects, skills, and experience.{"\n"}
          I&apos;m passionate about creating innovative solutions!
        </Text>

        <View style={styles.urlContainer}>
          <Text style={styles.urlText}>kishlaykumar.onrender.com</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={openPortfolio}
          >
            <Text style={styles.primaryButtonText}>🚀 Open Portfolio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onBack}
          >
            <Text style={styles.secondaryButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
    width: "100%",
    maxWidth: 380,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#6c5ce7",
    resizeMode: "cover",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00b894",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d3436",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  requestBox: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#6c5ce7",
  },
  requestText: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#6c5ce7",
    shadowColor: "#6c5ce7",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "#ddd6fe",
    borderWidth: 2,
    borderColor: "#a855f7",
  },
  secondaryButtonText: {
    color: "#7c3aed",
    fontSize: 16,
    fontWeight: "600",
  },
  portfolioButton: {
    backgroundColor: "#00b894",
    shadowColor: "#00b894",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  portfolioButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  successIcon: {
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 48,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#00b894",
    marginBottom: 16,
    textAlign: "center",
  },
  rejectedTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#636e72",
    marginBottom: 16,
    textAlign: "center",
  },
  portfolioHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  portfolioTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2d3436",
    marginBottom: 4,
  },
  portfolioSubtitle: {
    fontSize: 14,
    color: "#6c5ce7",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  urlContainer: {
    backgroundColor: "#f1f3f4",
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  urlText: {
    fontSize: 14,
    color: "#2d3436",
    fontWeight: "600",
    textAlign: "center",
  },
});
