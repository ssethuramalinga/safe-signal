import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, PressableStateCallbackType } from "react-native";

export type Option<T extends string> = { value: T; label: string; description?: string };

export function OptionPicker<T extends string>(props: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => props.options.find((o) => o.value === props.value), [props.options, props.value]);

  return (
    <>
      <Pressable
        onPress={() => !props.disabled && setOpen(true)}
        style={({ pressed }: PressableStateCallbackType) => [
          styles.pill, 
          pressed ? { opacity: 0.7 } : null, 
          props.disabled ? { opacity: 0.5 } : null
        ]}
        disabled={props.disabled}
      >
        <Text style={styles.pillLabel}>{props.label}</Text>
        <Text style={styles.pillValue}>{selected?.label ?? String(props.value)}</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{props.label}</Text>
          {props.options.map((o) => {
            const isSel = o.value === props.value;
            return (
              <Pressable
                key={o.value}
                style={({ pressed }: PressableStateCallbackType) => [
                  styles.option, 
                  pressed ? { opacity: 0.7 } : null, 
                  isSel ? styles.optionSelected : null
                ]}
                onPress={() => {
                  props.onChange(o.value);
                  setOpen(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionLabel}>{o.label}</Text>
                  {o.description ? <Text style={styles.optionDesc}>{o.description}</Text> : null}
                </View>
                {isSel ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            );
          })}
          <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.04)", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  pillLabel: { fontSize: 13, fontWeight: "600" },
  pillValue: { fontSize: 13, color: "rgba(0,0,0,0.65)" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: { backgroundColor: "#fff", padding: 14, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  sheetTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  option: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  optionSelected: { backgroundColor: "rgba(0,0,0,0.04)" },
  optionLabel: { fontSize: 14, fontWeight: "700" },
  optionDesc: { marginTop: 2, fontSize: 12, color: "rgba(0,0,0,0.55)" },
  check: { fontSize: 16, fontWeight: "900" },
  closeBtn: { marginTop: 10, paddingVertical: 12, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.08)", alignItems: "center" },
  closeText: { fontSize: 14, fontWeight: "700" },
});