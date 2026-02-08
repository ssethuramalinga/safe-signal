import React, { useMemo, useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';

import { useSettings } from "../hooks/useSettings";
import { useShakeDetector } from "../hooks/useShakeDetector";
import { applyTemplate } from "../utils/format"; // Ensure this path is correct
import { SectionCard } from "../components/SectionCard";
import { ContactEditorModal } from "../components/ContactEditorModal";

export function SettingsScreen() {
  const { loading, settings, contacts, contactActions } = useSettings();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<any>(undefined);
  const [shakeCount, setShakeCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // 1. Stable Template Preview
  const templatePreview = useMemo(() => {
    if (!settings?.templates?.defaultMessage) return "Emergency Alert! I need help.";
    return applyTemplate(settings.templates.defaultMessage, { 
      NAME: "User", 
      LOCATION: "Current Location", 
      TIME: new Date().toLocaleTimeString() 
    });
  }, [settings?.templates?.defaultMessage]);

  // 2. Stable Trigger Logic
  const triggerEmergency = useCallback(async () => {
    if (isSending) return;
    if (!contacts || contacts.length === 0) {
      Alert.alert("No Contacts", "Please add emergency contacts first.");
      return;
    }

    setIsSending(true);
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "SMS is not supported on this device.");
        return;
      }

      let locationLink = "";
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        locationLink = `https://www.google.com/maps?q=${loc.coords.latitude},${loc.coords.longitude}`;
      }

      const addresses = contacts.map((c: any) => c.phone);
      const finalMessage = `${templatePreview}\n\nMy Location: ${locationLink || "Unavailable"}`;
      
      await SMS.sendSMSAsync(addresses, finalMessage);
    } catch (e) {
      Alert.alert("Failed", "Could not trigger emergency SMS.");
    } finally {
      setIsSending(false);
    }
  }, [contacts, templatePreview, isSending]);

  // 3. Stable Shake Handler
  const handleShake = useCallback(() => {
    setShakeCount(prev => prev + 1);
    triggerEmergency();
  }, [triggerEmergency]);

  useShakeDetector({
    enabled: !!(settings?.gesture?.enabled && settings?.gesture?.type === "shake"),
    sensitivity: settings?.gesture?.shakeSensitivity ?? 1.5,
    onShake: handleShake,
  });

  if (loading || !settings) {
    return (
      <View style={styles.safe}>
        <Text>Loading secure settings…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.safe} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>Settings</Text>

        <SectionCard title="" subtitle="">
          <Pressable 
            style={[styles.primaryBtn, { backgroundColor: '#FF3B30' }]} 
            onPress={triggerEmergency}
          >
            <Text style={styles.primaryText}>
              {isSending ? "Processing..." : "Send Emergency SMS"}
            </Text>
          </Pressable>
          <Text style={styles.statusText}>Shakes detected: {shakeCount}</Text>
        </SectionCard>

        <SectionCard title="Emergency Contacts">
          {contacts.map((c: any) => (
            <View key={c.id} style={styles.contactCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactMeta}>{c.phone}</Text>
              </View>
              <Pressable 
                style={styles.smallBtn} 
                onPress={() => { setEditing(c); setEditorOpen(true); }}
              >
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
            </View>
          ))}
          <Pressable 
            style={styles.primaryBtn} 
            onPress={() => { setEditing(undefined); setEditorOpen(true); }}
          >
            <Text style={styles.primaryText}>Add Contact</Text>
          </Pressable>
        </SectionCard>
      </ScrollView>

      <ContactEditorModal
        visible={editorOpen}
        initial={editing}
        onClose={() => setEditorOpen(false)}
        onSave={contactActions.add}
        onUpdate={contactActions.update}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F6F8" },
  content: { padding: 16, paddingBottom: 60 },
  h1: { fontSize: 32, fontWeight: "900", marginBottom: 20 },
  contactCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 12, 
    borderRadius: 16, 
    backgroundColor: "rgba(0,0,0,0.04)",
    marginBottom: 8 
  },
  contactName: { fontSize: 15, fontWeight: "800" },
  contactMeta: { fontSize: 13, color: "rgba(0,0,0,0.5)" },
  smallBtn: { padding: 8, borderRadius: 12, backgroundColor: "#fff" },
  smallBtnText: { fontSize: 12, fontWeight: "700" },
  primaryBtn: { padding: 16, borderRadius: 16, backgroundColor: "#000", alignItems: "center", marginTop: 8 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  statusText: { fontSize: 12, marginTop: 12, color: "rgba(0,0,0,0.4)", fontWeight: "600" },
});