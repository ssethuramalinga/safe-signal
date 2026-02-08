import React from "react";
import { Pressable, StyleSheet, Text, View, PressableStateCallbackType } from "react-native";

interface RowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export function Row(props: RowProps) {
  const content = (
    <View style={[styles.row, props.disabled ? { opacity: 0.45 } : null]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{props.label}</Text>
        {props.description ? <Text style={styles.desc}>{props.description}</Text> : null}
      </View>
      {props.value ? <Text style={styles.value}>{props.value}</Text> : null}
      {props.right ? <View style={{ marginLeft: 8 }}>{props.right}</View> : null}
    </View>
  );

  if (!props.onPress) return content;

  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.press, 
        pressed ? { opacity: 0.65 } : null
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { fontSize: 14, fontWeight: "600" },
  desc: { marginTop: 2, fontSize: 12, color: "rgba(0,0,0,0.55)" },
  value: { fontSize: 13, color: "rgba(0,0,0,0.65)" },
});