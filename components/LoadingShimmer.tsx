import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/design";

const LoadingShimmer = () => (
  <View style={styles.container}>
    {[...Array(5)].map((_, i) => (
      <View key={i} style={styles.shimmerLine} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
  },
  shimmerLine: {
    height: 20,
    backgroundColor: "#ECF0F1",
    borderRadius: 4,
    marginBottom: 16,
  },
});

export default LoadingShimmer;
