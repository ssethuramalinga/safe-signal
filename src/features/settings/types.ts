export type UUID = string;

export type Relationship =
  | "Parent"
  | "Sibling"
  | "Spouse"
  | "Partner"
  | "Friend"
  | "Roommate"
  | "Coworker"
  | "Other";

export type GestureType = "shake" | "volume" | "power";
export type DecoyType = "calculator" | "weather" | "notes" | "browser";

export type VoiceType = "female" | "male" | "neutral";
export type VoiceTone = "casual" | "concerned" | "professional";

export type AutoDeletePolicy = "24h" | "7d" | "never";
export type LocationSharingPolicy = "always" | "duringAlerts" | "never";

export type EmergencyContact = {
  id: UUID;
  name: string;
  phone: string; // E.164-ish string, e.g., +19195551234 or digits only
  relationship?: Relationship;
  customMessage?: string; // Optional per-contact override
};

export type GestureSettings = {
  enabled: boolean;
  type: GestureType;
  practiceMode: boolean;
  // Shake sensitivity: 0.5 (least sensitive) -> 3.0 (most sensitive)
  shakeSensitivity: number;
};

export type TemplateSettings = {
  defaultMessage: string;
};

export type VoiceSettings = {
  voiceType: VoiceType;
  tone: VoiceTone;
  volume: number; // 0..1
};

export type DecoySettings = {
  enabled: boolean;
  selected: DecoyType;
  practiceMode: boolean;
};

export type PrivacySettings = {
  autoDelete: AutoDeletePolicy;
  locationSharing: LocationSharingPolicy;
};

export type AppSettings = {
  version: 1;
  emergencyContacts: EmergencyContact[];
  walkingModeAutoNotify: boolean;

  gesture: GestureSettings;
  templates: TemplateSettings;
  voice: VoiceSettings;
  decoy: DecoySettings;
  privacy: PrivacySettings;
};
