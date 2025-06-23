import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "../constants/design";

const LoadingShimmer = () => {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    const animate = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(animate);
    };
    animate();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={styles.shimmerLine}>
          <Animated.View
            style={[styles.shimmerEffect, { transform: [{ translateX }] }]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    overflow: "hidden",
  },
  shimmerLine: {
    height: 20,
    backgroundColor: colors.shimmerLight,
    borderRadius: 8,
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  shimmerEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: colors.shimmerDark,
  },
});

export default LoadingShimmer;
