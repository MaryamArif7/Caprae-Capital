import { Router, Request, Response } from "express";
import twilio from "twilio";
import { twilioClient } from "../twilioClient";
import { env, assertCallEnvReady } from "../env";
import { isValidPhone, normalizePhone } from "../validate";

export const callsRouter = Router();
callsRouter.post("/", async (req: Request, res: Response) => {
  const missingEnv = assertCallEnvReady();
  if (missingEnv.length > 0) {
    return res.status(500).json({
      success: false,
      error: `Server is missing required config: ${missingEnv.join(", ")}`,
    });
  }

  const { phoneNumber } = req.body ?? {};
  if (!isValidPhone(phoneNumber)) {
    return res.status(400).json({
      success: false,
      error: "A valid phoneNumber is required (e.g. +15551234567)",
    });
  }
  const leadPhone = normalizePhone(phoneNumber);
  try {
    const call = await twilioClient.calls.create({
      to: env.agentPhoneNumber,
      from: env.twilioPhoneNumber,
      url: `${env.publicBaseUrl}/api/calls/twiml?leadPhone=${encodeURIComponent(leadPhone)}`,
      method: "POST",
    });

    return res.json({
      success: true,
      callSid: call.sid,
      status: call.status,
    });
  } catch (error: any) {
    console.error("[calls] Twilio call failed:", error?.message || error);
    return res.status(502).json({
      success: false,
      error: error?.message || "Failed to start call",
    });
  }
});


callsRouter.post("/twiml", (req: Request, res: Response) => {
  const leadPhone = req.query.leadPhone;
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  if (typeof leadPhone !== "string" || !isValidPhone(leadPhone)) {
    twiml.say("Sorry, we could not connect this call. The lead number was invalid.");
    res.type("text/xml");
    return res.send(twiml.toString());
  }

  const dial = twiml.dial({ callerId: env.twilioPhoneNumber });
  dial.number(leadPhone);

  res.type("text/xml");
  res.send(twiml.toString());
});
