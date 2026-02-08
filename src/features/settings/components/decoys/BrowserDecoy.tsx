import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

type Item = { id: string; title: string; url: string; snippet: string };

const FEED: Item[] = [
  { id: "1", title: "How to cook pasta al dente", url: "food.example.com", snippet: "Timing, salt, and a quick taste test..." },
  { id: "2", title: "Best budget laptops in 2026", url: "tech.example.com", snippet: "A comparison of value picks with good battery..." },
  { id: "3", title: "Local events this weekend", url: "city.example.com", snippet: "Markets, music, and family-friendly activities..." },
  { id: "4", title: "Stretch routine for desk workers", url: "health.example.com", snippet: "Five easy stretches to reduce stiffness..." },
];

export function BrowserDecoy() {
  const [url, setUrl] = useState("https://example.com");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FEED;
    return FEED.filter((i) => (i.title + i.snippet).toLowerCase().includes(s));
  }, [q]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <TextInput value={url} onChangeText={setUrl} style={styles.url} autoCapitalize="none" autoCorrect={false} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search" placeholderTextColor="rgba(255,255,255,0.6)" style={styles.search} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 14 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.urlSmall}>{item.url}</Text>
            <Text style={styles.snip}>{item.snippet}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0E" },
  top: { padding: 14, gap: 10 },
  url: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
  },
  search: {
    backgroundColor: "rgba(255,255,255,0.10)",
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  title: { color: "#fff", fontWeight: "900", fontSize: 14 },
  urlSmall: { color: "rgba(255,255,255,0.7)", marginTop: 4, fontSize: 12 },
  snip: { color: "rgba(255,255,255,0.75)", marginTop: 6, fontSize: 13, lineHeight: 18 },
});
