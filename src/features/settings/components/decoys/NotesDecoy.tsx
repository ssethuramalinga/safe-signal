import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

type Note = { id: string; title: string; body: string; date: string };

const SEED: Note[] = [
  { id: "1", title: "Groceries", body: "Eggs, milk, spinach, coffee", date: "Today" },
  { id: "2", title: "Work", body: "Email the report. Review PRs.", date: "Yesterday" },
  { id: "3", title: "Ideas", body: "Weekend hike. Read that book.", date: "Mon" },
];

export function NotesDecoy() {
  const [q, setQ] = useState("");
  const [notes, setNotes] = useState(SEED);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return notes;
    return notes.filter((n) => (n.title + " " + n.body).toLowerCase().includes(s));
  }, [q, notes]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
      </View>

      <View style={styles.search}>
        <TextInput value={q} onChangeText={setQ} placeholder="Search" placeholderTextColor="rgba(0,0,0,0.4)" style={styles.input} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 14 }}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>
            </View>
            <Text style={styles.noteBody} numberOfLines={2}>{item.body}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F5F7" },
  header: { padding: 14, paddingBottom: 6 },
  title: { fontSize: 22, fontWeight: "900" },
  search: { paddingHorizontal: 14, paddingBottom: 8 },
  input: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  note: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
  },
  noteTitle: { fontSize: 15, fontWeight: "800", flex: 1 },
  noteDate: { fontSize: 12, color: "rgba(0,0,0,0.5)" },
  noteBody: { marginTop: 6, fontSize: 13, color: "rgba(0,0,0,0.65)" },
});
