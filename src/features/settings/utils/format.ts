export function normalizePhone(input: string): string {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return "";
  // Keep leading +, strip everything else non-digit
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^0-9]/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function isValidPhone(phone: string): boolean {
  const p = normalizePhone(phone);
  const digits = p.startsWith("+") ? p.slice(1) : p;
  // Basic validation: 10-15 digits typical for E.164
  return digits.length >= 10 && digits.length <= 15;
}

export function safeTrim(s: string): string {
  return (s ?? "").trim();
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function formatTimeISOToLocal(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export function applyTemplate(
  template: string,
  vars: { NAME: string; LOCATION: string; TIME: string }
): string {
  const t = template ?? "";
  return t
    .replaceAll("[NAME]", vars.NAME)
    .replaceAll("[LOCATION]", vars.LOCATION)
    .replaceAll("[TIME]", vars.TIME);
}

export const TEMPLATE_VARS = ["[LOCATION]", "[TIME]", "[NAME]"] as const;

export function insertAt(text: string, insert: string, selectionStart: number, selectionEnd: number) {
  const start = Math.max(0, Math.min(text.length, selectionStart));
  const end = Math.max(0, Math.min(text.length, selectionEnd));
  return text.slice(0, start) + insert + text.slice(end);
}
