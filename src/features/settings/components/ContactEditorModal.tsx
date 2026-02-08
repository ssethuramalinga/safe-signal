import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { EmergencyContact, Relationship } from "../types";
import { isValidPhone, normalizePhone, safeTrim } from "../utils/format";
import { OptionPicker } from "./OptionPicker";

const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: "Parent", label: "Parent" },
  { value: "Sibling", label: "Sibling" },
  { value: "Spouse", label: "Spouse" },
  { value: "Partner", label: "Partner" },
  { value: "Friend", label: "Friend" },
  { value: "Roommate", label: "Roommate" },
  { value: "Coworker", label: "Coworker" },
  { value: "Other", label: "Other" },
];

type PhoneContact = { id: string; name: string; phone: string };

export function ContactEditorModal(props: {
  visible: boolean;
  onClose: () => void;
  initial?: EmergencyContact;
  onSave: (contact: Omit<EmergencyContact, "id">) => void;
  onUpdate?: (contact: EmergencyContact) => void;
}) {
  const editing = Boolean(props.initial?.id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("Friend");
  const [error, setError] = useState<string | null>(null);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([]);

  useEffect(() => {
    if (!props.visible) return;
    const init = props.initial;
    setName(init?.name ?? "");
    setPhone(init?.phone ?? "");
    setRelationship((init?.relationship as Relationship) ?? "Friend");
    setError(null);
    setPickerVisible(false);
    setPickerLoading(false);
    setPickerQuery("");
    setPhoneContacts([]);
  }, [props.visible, props.initial]);

  const canSave = useMemo(() => {
    const n = safeTrim(name);
    const p = normalizePhone(phone);
    return n.length >= 2 && isValidPhone(p);
  }, [name, phone]);

  function validate(): boolean {
    const n = safeTrim(name);
    const p = normalizePhone(phone);
    if (n.length < 2) {
      setError("Name must be at least 2 characters.");
      return false;
    }
    if (!isValidPhone(p)) {
      setError("Please enter a valid phone number (10–15 digits).");
      return false;
    }
    setError(null);
    return true;
  }

  async function openPhoneContactsPicker() {
    // Optional dependency: expo-contacts
    let Contacts: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Contacts = require("expo-contacts");
    } catch {
      Alert.alert(
        "Contacts not available",
        "To pick a contact from your phone, install expo-contacts:\n\n  npx expo install expo-contacts"
      );
      return;
    }

    try {
      setPickerLoading(true);
      const perm = await Contacts.requestPermissionsAsync();
      if (perm?.status !== "granted") {
        Alert.alert("Permission required", "Please allow Contacts access to pick from your phone.");
        return;
      }

      const res = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
        pageSize: 1000,
        sort: Contacts.SortTypes?.FirstName ?? undefined,
      });

      const list: PhoneContact[] = (res?.data ?? [])
        .map((c: any) => {
          const raw = c?.phoneNumbers?.[0]?.number;
          const n = safeTrim(c?.name ?? "");
          const p = normalizePhone(String(raw ?? ""));
          if (!n || !isValidPhone(p)) return null;
          return { id: String(c?.id ?? n + p), name: n, phone: p };
        })
        .filter(Boolean);

      if (list.length === 0) {
        Alert.alert("No contacts found", "We couldn't find any contacts with a valid phone number.");
        return;
      }

      setPhoneContacts(list);
      setPickerQuery("");
      setPickerVisible(true);
    } catch (e) {
      Alert.alert("Couldn't load contacts", "Try again or add the contact manually.");
    } finally {
      setPickerLoading(false);
    }
  }

  const filteredPhoneContacts = useMemo(() => {
    const q = safeTrim(pickerQuery).toLowerCase();
    if (!q) return phoneContacts;
    return phoneContacts.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [phoneContacts, pickerQuery]);

  return (
    <Modal visible={props.visible} animationType="slide" onRequestClose={props.onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={props.onClose} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Close</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{editing ? "Edit Contact" : "Add Contact"}</Text>
          <View style={{ width: 68 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Alex Johnson"
            style={styles.input}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={(t) => setPhone(normalizePhone(t))}
            placeholder="e.g., +1 919 555 1234"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <Pressable
            onPress={openPhoneContactsPicker}
            style={({ pressed }) => [styles.pickBtn, pressed ? { opacity: 0.7 } : null]}
          >
            <Text style={styles.pickBtnText}>{pickerLoading ? "Loading contacts…" : "Pick from phone"}</Text>
          </Pressable>

          <OptionPicker
            label="Relationship"
            value={relationship}
            options={RELATIONSHIP_OPTIONS}
            onChange={(v) => setRelationship(v)}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={!canSave}
            onPress={() => {
              if (!validate()) return;
              const payload: Omit<EmergencyContact, "id"> = {
                name: safeTrim(name),
                phone: normalizePhone(phone),
                relationship,
              };
              if (editing && props.initial && props.onUpdate) {
                props.onUpdate({ ...props.initial, ...payload });
              } else {
                props.onSave(payload);
              }
              props.onClose();
            }}
            style={({ pressed }) => [
              styles.save,
              !canSave ? { opacity: 0.5 } : null,
              pressed ? { opacity: 0.7 } : null,
            ]}
          >
            <Text style={styles.saveText}>{editing ? "Update" : "Save"}</Text>
          </Pressable>
        </View>

        {/* Phone contacts picker */}
        <Modal
          visible={pickerVisible}
          animationType="slide"
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={styles.pickerHeader}>
            <Pressable onPress={() => setPickerVisible(false)} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Back</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Select a Contact</Text>
            <View style={{ width: 68 }} />
          </View>

          <View style={styles.pickerBody}>
            <TextInput
              value={pickerQuery}
              onChangeText={setPickerQuery}
              placeholder="Search by name or number"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <FlatList
              data={filteredPhoneContacts}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setName(item.name);
                    setPhone(item.phone);
                    setPickerVisible(false);
                  }}
                  style={({ pressed }) => [styles.pickerRow, pressed ? { opacity: 0.7 } : null]}
                >
                  <Text style={styles.pickerName}>{item.name}</Text>
                  <Text style={styles.pickerPhone}>{item.phone}</Text>
                </Pressable>
              )}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.12)",
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  headerBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.06)" },
  headerBtnText: { fontWeight: "700" },

  body: { padding: 14, gap: 10 },
  label: { fontSize: 12, color: "rgba(0,0,0,0.6)", fontWeight: "700" },
  input: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  error: { color: "#B00020", fontSize: 12, fontWeight: "700" },
  save: {
    marginTop: 6,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  pickBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pickBtnText: { fontWeight: "800", color: "rgba(0,0,0,0.8)" },

  pickerHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.12)",
  },
  pickerBody: { flex: 1, padding: 14, gap: 10 },
  pickerRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  pickerName: { fontWeight: "900", fontSize: 14 },
  pickerPhone: { marginTop: 2, color: "rgba(0,0,0,0.6)", fontWeight: "700" },
  sep: { height: 10 },
});
