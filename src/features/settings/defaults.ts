import type { AppSettings } from "./types";

export const SETTINGS_STORAGE_KEY = "safetyapp.settings.v1";
export const LOCATION_HISTORY_KEY = "safetyapp.locationHistory.v1";
export const ALERT_LOG_KEY = "safetyapp.alertLogs.v1";

export const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  emergencyContacts: [],
  walkingModeAutoNotify: true,

  gesture: {
    enabled: true,
    type: "shake",
    practiceMode: true,
    shakeSensitivity: 1.4,
  },

  templates: {
    defaultMessage:
      "Hi, this is [NAME]. I may be in danger. My location is [LOCATION]. Time: [TIME]. Please help and contact emergency services if needed.",
  },

  voice: {
    voiceType: "neutral",
    tone: "concerned",
    volume: 0.8,
  },

  decoy: {
    enabled: true,
    selected: "calculator",
    practiceMode: true,
  },

  privacy: {
    autoDelete: "7d",
    locationSharing: "duringAlerts",
  },
};
