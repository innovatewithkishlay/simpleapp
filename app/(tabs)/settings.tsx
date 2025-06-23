import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "../../constants/design";

const PROFILE_IMAGE = "https://avatars.githubusercontent.com/u/181485485?v=4";
const PORTFOLIO_URL = "https://kishlaykumar.onrender.com";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: 56 + insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.aboutHeader}>
          <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Kishlay Kumar</Text>
            <Text style={styles.role}>Full-Stack Developer</Text>
          </View>
        </View>
        <Text style={styles.aboutText}>
          Hi! I am a passionate Fullstack developer who loves building modern,
          user-centric apps and digital experiences. I focus on clean code,
          beautiful UIs, and solving real problems.
        </Text>
        <TouchableOpacity
          style={styles.portfolioButton}
          onPress={() => Linking.openURL(PORTFOLIO_URL)}
        >
          <Ionicons name="globe-outline" size={20} color="white" />
          <Text style={styles.portfolioText}>View Developer Portfolio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="privacy-tip" size={22} color={colors.primary} />
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
        </View>
        <Text style={styles.sectionContent}>
          Your privacy is important to us. WordWise does not collect or share
          personal data. All your saved words and preferences stay on your
          device.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="copyright-outline" size={22} color={colors.primary} />
          <Text style={styles.sectionTitle}>Copyright</Text>
        </View>
        <Text style={styles.sectionContent}>
          © {new Date().getFullYear()} Kishlay Kumar. All rights reserved. This
          app and its content are protected by copyright and intellectual
          property laws.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
    gap: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 0,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
  },
  name: {
    ...typography.title,
    color: colors.primary,
    fontSize: 22,
    marginBottom: 2,
  },
  role: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: "600",
    fontSize: 15,
  },
  aboutText: {
    ...typography.body,
    color: colors.text,
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  portfolioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    gap: 8,
  },
  portfolioText: {
    ...typography.button,
    color: "white",
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.primary,
  },
  sectionContent: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    fontSize: 15,
  },
});
