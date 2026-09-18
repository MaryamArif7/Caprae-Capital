import twilio from "twilio";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.warn(
    "[twilio] TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN are not set. Call and SMS routes will fail until .env is configured."
  );
}

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
