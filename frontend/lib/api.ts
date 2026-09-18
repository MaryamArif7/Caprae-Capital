const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export type ActionResult =
  | { success: true; [key: string]: unknown }
  | { success: false; error: string };

async function postJson(path: string, body: unknown): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        error: data?.error || `Request failed (${res.status})`,
      };
    }

    return data as ActionResult;
  } catch {
    return {
      success: false,
      error: "Couldn't reach the server. Check your connection and try again.",
    };
  }
}

export function startCall(phoneNumber: string) {
  return postJson("/api/calls", { phoneNumber });
}

export function sendSms(phoneNumber: string, message: string) {
  return postJson("/api/messages", { phoneNumber, message });
}
