import React, { useMemo, useRef } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import type { DecoyType } from "../types";
import { CalculatorDecoy } from "./decoys/CalculatorDecoy";
import { WeatherDecoy } from "./decoys/WeatherDecoy";
import { NotesDecoy } from "./decoys/NotesDecoy";
import { BrowserDecoy } from "./decoys/BrowserDecoy";

export function DecoyModal(props: { visible: boolean; type: DecoyType; onRequestClose: () => void }) {
  const taps = useRef<number[]>([]);

  const Decoy = useMemo(() => {
    switch (props.type) {
      case "calculator":
        return CalculatorDecoy;
      case "weather":
        return WeatherDecoy;
      case "notes":
        return NotesDecoy;
      case "browser":
        return BrowserDecoy;
      default:
        return CalculatorDecoy;
    }
  }, [props.type]);

  function onSecretTap() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 1200), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      props.onRequestClose();
    }
  }

  return (
    <Modal visible={props.visible} animationType="fade" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Secret exit area: top-left corner tap 3x */}
        <Pressable onPress={onSecretTap} style={styles.secretHitbox} />
        <Decoy />
        {/* Optional: tap outside isn't possible in full-screen; exit only via secret gesture */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  secretHitbox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 70,
    height: 70,
    zIndex: 10,
  },
});
