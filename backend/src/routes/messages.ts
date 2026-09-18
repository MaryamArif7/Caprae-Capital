import { Router, Request, Response } from "express";
import { twilioClient } from "../twilioClient";
import { env, assertMessageEnvReady } from "../env";
import { isValidPhone, normalizePhone } from "../validate";

export const messagesRouter = Router();

const MAX_MESSAGE_LENGTH = 1600;

messagesRouter.post("/", async (req: Request, res: Response) => {
  const missingEnv = assertMessageEnvReady();
  if (missingEnv.length > 0) {
    return res.status(500).json({
      success: false,
      error: `Server is missing required config: ${missingEnv.join(", ")}`,
    });
  }

  const { phoneNumber, message } = req.body ?? {};

  if (!isValidPhone(phoneNumber)) {
    return res.status(400).json({
      success: false,
      error: "A valid phoneNumber is required (e.g. +15551234567)",
    });
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: "message is required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `message is too long (max ${MAX_MESSAGE_LENGTH} characters)`,
    });
  }

  try {
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: env.twilioPhoneNumber,
      to: normalizePhone(phoneNumber),
    });

    return res.json({
      success: true,
      messageSid: twilioMessage.sid,
      status: twilioMessage.status,
    });
  } catch (error: any) {
    console.error("[messages] Twilio send failed:", error?.message || error);
    return res.status(502).json({
      success: false,
      error: error?.message || "Failed to send message",
    });
  }
});
