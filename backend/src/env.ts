export const env = {
  port: process.env.PORT || 4000,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  agentPhoneNumber: process.env.AGENT_PHONE_NUMBER || "",
  publicBaseUrl: process.env.PUBLIC_BASE_URL || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

export function assertCallEnvReady() {
  const missing: string[] = [];
  if (!env.twilioPhoneNumber) missing.push("TWILIO_PHONE_NUMBER");
  if (!env.agentPhoneNumber) missing.push("AGENT_PHONE_NUMBER");
  if (!env.publicBaseUrl) missing.push("PUBLIC_BASE_URL");
  return missing;
}

export function assertMessageEnvReady() {
  const missing: string[] = [];
  if (!env.twilioPhoneNumber) missing.push("TWILIO_PHONE_NUMBER");
  return missing;
}
