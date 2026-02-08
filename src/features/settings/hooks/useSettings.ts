import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY, LOCATION_HISTORY_KEY, ALERT_LOG_KEY } from "../defaults";
import type { AppSettings, EmergencyContact } from "../types";
import { readJSON, removeKey, writeJSON } from "../storage";

export function useSettings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  const diskValueRef = useRef<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await readJSON<Partial<AppSettings>>(SETTINGS_STORAGE_KEY);
      if (alive && stored) {
        const merged = { ...DEFAULT_SETTINGS, ...stored };
        diskValueRef.current = JSON.stringify(merged);
        setSettings(merged);
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const update = useCallback((patch: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    setSettings((prev) => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      if (JSON.stringify(next) === JSON.stringify(prev)) return prev;
      
      const serialized = JSON.stringify(next);
      if (serialized !== diskValueRef.current) {
        diskValueRef.current = serialized;
        void writeJSON(SETTINGS_STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  // 1. Define contactActions
  const contactActions = useMemo(() => ({
    add: (contact: Omit<EmergencyContact, "id">) => {
      update((prev) => ({
        ...prev,
        emergencyContacts: [
          ...(prev.emergencyContacts || []),
          { ...contact, id: Date.now().toString() }
        ].slice(0, 5),
      }));
    },
    update: (contact: EmergencyContact) => {
      update((prev) => ({
        ...prev,
        emergencyContacts: (prev.emergencyContacts || []).map((c) => 
          c.id === contact.id ? contact : c
        ),
      }));
    },
    remove: (id: string) => {
      update((prev) => ({
        ...prev,
        emergencyContacts: (prev.emergencyContacts || []).filter((c) => c.id !== id),
      }));
    },
  }), [update]);

  // 2. Define gestureHelpers
  const gestureHelpers = useMemo(() => ({
    setShakeSensitivity: (v: number) => {
      update((prev) => ({
        ...prev,
        gesture: { ...prev.gesture, shakeSensitivity: v },
      }));
    },
  }), [update]);

  // 3. Define privacyActions (in case your screen calls them)
  const privacyActions = useMemo(() => ({
    clearAllData: async () => {
      await removeKey(LOCATION_HISTORY_KEY);
      await removeKey(ALERT_LOG_KEY);
    }
  }), []);

  // Final Return
  return {
    loading,
    settings,
    update,
    contacts: settings.emergencyContacts || [],
    contactActions, // Check: matches variable name above
    gestureHelpers, // Check: matches variable name above
    privacyActions,
  };
}