
const PHONE_RE = /^\+?[1-9]\d{7,14}$/;
export function isValidPhone(phone: unknown): phone is string {
  return typeof phone === "string" && PHONE_RE.test(phone.trim());
}
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed.replace(/\D/g, "")}`;
}
