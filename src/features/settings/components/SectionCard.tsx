import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function SectionCard(props: { title: string; children: React.ReactNode; subtitle?: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
        {props.subtitle ? <Text style={styles.subtitle}>{props.subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
  },
  header: { marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { marginTop: 4, fontSize: 12, color: "rgba(0,0,0,0.55)" },
  body: { gap: 10 },
});
