import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

type Forecast = { day: string; high: string; low: string; note: string };

const DEFAULT_FORECAST: Forecast[] = [
  { day: "Today", high: "59°", low: "41°", note: "Mostly sunny" },
  { day: "Sun", high: "57°", low: "39°", note: "Partly cloudy" },
  { day: "Mon", high: "54°", low: "38°", note: "Light rain" },
  { day: "Tue", high: "50°", low: "36°", note: "Cloudy" },
  { day: "Wed", high: "55°", low: "40°", note: "Sunny" },
  { day: "Thu", high: "58°", low: "42°", note: "Breezy" },
];

export function WeatherDecoy() {
  const [city, setCity] = useState("Indianapolis");
  const now = useMemo(() => new Date().toLocaleString(), []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather</Text>
        <Text style={styles.sub}>{now}</Text>
      </View>

      <View style={styles.search}>
        <TextInput value={city} onChangeText={setCity} placeholder="Search city" style={styles.input} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.temp}>56°</Text>
        <Text style={styles.note}>Feels like 54° · Mostly sunny</Text>
      </View>

      <FlatList
        data={DEFAULT_FORECAST}
        keyExtractor={(i) => i.day}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 14 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.noteRow}>{item.note}</Text>
            <Text style={styles.hilo}>
              {item.high} / {item.low}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1320" },
  header: { padding: 14 },
  title: { color: "#fff", fontSize: 18, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.6)", marginTop: 4, fontSize: 12 },

  search: { paddingHorizontal: 14, paddingBottom: 6 },
  input: {
    backgroundColor: "rgba(255,255,255,0.10)",
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  hero: { paddingHorizontal: 14, paddingVertical: 14 },
  city: { color: "#fff", fontSize: 22, fontWeight: "900" },
  temp: { color: "#fff", fontSize: 72, fontWeight: "200", marginTop: 6 },
  note: { color: "rgba(255,255,255,0.65)", marginTop: 4 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)",
    gap: 10,
  },
  day: { color: "#fff", width: 62, fontWeight: "800" },
  noteRow: { color: "rgba(255,255,255,0.7)", flex: 1 },
  hilo: { color: "#fff", fontWeight: "800" },
});
