"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { sendSms } from "@/lib/api";
import { useToast } from "./ToastProvider";

const MAX_LENGTH = 320; 

export function MessageModal({
  leadName,
  phoneNumber,
  onClose,
}: {
  leadName: string;
  phoneNumber: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { notify } = useToast();

  const remaining = MAX_LENGTH - message.length;
  const canSend = message.trim().length > 0 && remaining >= 0 && !isSending;

  async function handleSend() {
    if (!canSend) return;
    setIsSending(true);

    const result = await sendSms(phoneNumber, message.trim());

    setIsSending(false);

    if (result.success) {
      notify("success", `Message sent to ${leadName}.`);
      onClose();
    } else {
      notify("error", `Couldn't send message to ${leadName}: ${result.error}`);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Message {leadName}</h2>
            <p className="font-data text-xs text-muted">{phoneNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
          placeholder="Type your message…"
          rows={4}
          autoFocus
          className="w-full resize-none rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-relay disabled:opacity-60"
        />

        <div className="mt-1.5 flex justify-end">
          <span className={`font-data text-xs ${remaining < 0 ? "text-danger" : "text-muted"}`}>
            {remaining} left
          </span>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="inline-flex items-center gap-1.5 rounded-md bg-relay px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send size={14} />
            )}
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
