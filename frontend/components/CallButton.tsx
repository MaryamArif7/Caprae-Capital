"use client";

import { useState } from "react";
import { PhoneCall, Check, X } from "lucide-react";
import { startCall } from "@/lib/api";
import { useToast } from "./ToastProvider";

type Status = "idle" | "calling" | "success" | "error";

export function CallButton({
  phoneNumber,
  leadName,
}: {
  phoneNumber: string;
  leadName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const { notify } = useToast();

  const isBusy = status === "calling";

  async function handleClick() {
    if (isBusy) return;
    setStatus("calling");

    const result = await startCall(phoneNumber);

    if (result.success) {
      setStatus("success");
      notify("success", `Calling ${leadName} — your phone will ring first.`);
    } else {
      setStatus("error");
      notify("error", `Couldn't start the call to ${leadName}: ${result.error}`);
    }

    setTimeout(() => setStatus("idle"), 2200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBusy}
      aria-label={`Call ${leadName}`}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
        status === "success"
          ? "border-connect-soft bg-connect-soft text-connect-ink"
          : status === "error"
          ? "border-danger-soft bg-danger-soft text-danger"
          : "border-border bg-surface text-ink hover:border-connect hover:text-connect-ink"
      }`}
    >
      {status === "calling" && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-connect border-t-transparent" />
      )}
      {status === "success" && <Check size={14} />}
      {status === "error" && <X size={14} />}
      {status === "idle" && <PhoneCall size={14} />}
      <span>
        {status === "calling"
          ? "Calling…"
          : status === "success"
          ? "Ringing"
          : status === "error"
          ? "Failed"
          : "Call"}
      </span>
    </button>
  );
}
