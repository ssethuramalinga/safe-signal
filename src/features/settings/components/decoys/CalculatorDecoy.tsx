import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const KEYS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
] as const;

type Op = "+" | "−" | "×" | "÷";

export function CalculatorDecoy() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);

  const big = useMemo(() => display.length > 10, [display]);

  function inputDigit(d: string) {
    setDisplay((prev) => {
      if (fresh || prev === "0") return d;
      return (prev + d).slice(0, 18);
    });
    setFresh(false);
  }

  function applyOp(nextOp: Op) {
    const current = Number(display);
    if (acc == null) {
      setAcc(current);
      setOp(nextOp);
      setFresh(true);
      return;
    }
    if (op) {
      const result = compute(acc, current, op);
      setAcc(result);
      setDisplay(format(result));
      setOp(nextOp);
      setFresh(true);
      return;
    }
    setOp(nextOp);
    setFresh(true);
  }

  function equals() {
    if (acc == null || !op) return;
    const current = Number(display);
    const result = compute(acc, current, op);
    setAcc(null);
    setOp(null);
    setDisplay(format(result));
    setFresh(true);
  }

  function press(key: string) {
    if (/[0-9]/.test(key)) return inputDigit(key);
    if (key === ".") {
      setDisplay((prev) => (prev.includes(".") ? prev : prev + "."));
      setFresh(false);
      return;
    }
    if (key === "C") {
      setDisplay("0");
      setAcc(null);
      setOp(null);
      setFresh(true);
      return;
    }
    if (key === "⌫") {
      setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
      return;
    }
    if (key === "±") {
      setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : prev === "0" ? prev : "-" + prev));
      return;
    }
    if (key === "%") {
      setDisplay((prev) => format(Number(prev) / 100));
      setFresh(true);
      return;
    }
    if (key === "=") return equals();
    if (key === "+") return applyOp("+");
    if (key === "−") return applyOp("−");
    if (key === "×") return applyOp("×");
    if (key === "÷") return applyOp("÷");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Text style={[styles.display, big ? { fontSize: 40 } : null]} numberOfLines={1}>
          {display}
        </Text>
      </View>
      <View style={styles.keys}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((k) => {
              const isOp = ["÷", "×", "−", "+", "="].includes(k);
              const isFn = ["C", "±", "%", "⌫"].includes(k);
              return (
                <Pressable
                  key={k}
                  onPress={() => press(k)}
                  style={({ pressed }) => [
                    styles.key,
                    isOp ? styles.opKey : null,
                    isFn ? styles.fnKey : null,
                    pressed ? { opacity: 0.7 } : null,
                    k === "0" ? styles.zeroKey : null,
                  ]}
                >
                  <Text style={[styles.keyText, isOp ? { color: "#fff" } : null]}>{k}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? 0 : a / b;
  }
}

function format(n: number): string {
  if (!isFinite(n)) return "0";
  const s = String(n);
  if (s.length > 18) return n.toExponential(8);
  return s;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0E" },
  screen: { flex: 1, justifyContent: "flex-end", padding: 18 },
  display: { color: "#fff", fontSize: 54, fontWeight: "300", textAlign: "right" },
  keys: { padding: 12, gap: 10 },
  row: { flexDirection: "row", gap: 10 },
  key: {
    flex: 1,
    height: 70,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  zeroKey: { flex: 2.12, alignItems: "flex-start", paddingLeft: 28 },
  opKey: { backgroundColor: "rgba(255,149,0,0.92)" },
  fnKey: { backgroundColor: "rgba(255,255,255,0.16)" },
  keyText: { color: "#fff", fontSize: 26, fontWeight: "600" },
});
