import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/design";

const SearchHeader = ({ value, onChange, onSearch }: any) => (
  <View style={styles.container}>
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={22}
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
        <TouchableOpacity onPress={() => onChange("")}>
          <Ionicons name="close-circle" size={22} color={colors.gray} />
        </TouchableOpacity>
      ) : null}
    </View>
    <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
      <Ionicons name="arrow-forward" size={24} color={colors.background} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  searchButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default SearchHeader;
