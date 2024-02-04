import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LittleLemonHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText} numberOfLines={1}>
        Little Lemon Restaurant
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c7c6c6",
    padding: 20,
    paddingTop: 40,
    width: "100%",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
  },
});