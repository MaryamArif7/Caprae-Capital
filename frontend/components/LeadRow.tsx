"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Lead } from "@/lib/types";
import { CallButton } from "./CallButton";
import { MessageModal } from "./MessageModal";
import { ScoreBadge } from "./ScoreBadge";

export function LeadRow({ lead }: { lead: Lead }) {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <>
      <tr className="border-b border-border last:border-0">
        <td className="px-4 py-3">
          <div className="font-medium text-ink">{lead.company}</div>
          <div className="text-xs text-muted">
            {lead.industry}
            {lead.employeeCount ? ` · ${lead.employeeCount} employees` : ""}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="text-ink">{lead.contactName}</div>
          <div className="text-xs text-muted">{lead.title}</div>
        </td>
        <td className="px-4 py-3">
          <div className="font-data text-sm text-ink">{lead.phone}</div>
          {lead.email && <div className="text-xs text-muted">{lead.email}</div>}
        </td>
        <td className="px-4 py-3">
          <ScoreBadge score={lead.score} />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <CallButton phoneNumber={lead.phone} leadName={lead.contactName} />
            <button
              type="button"
              onClick={() => setShowMessage(true)}
              aria-label={`Message ${lead.contactName}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-relay hover:text-relay-ink"
            >
              <MessageSquare size={14} />
              Message
            </button>
          </div>
        </td>
      </tr>

      {showMessage && (
        <MessageModal
          leadName={lead.contactName}
          phoneNumber={lead.phone}
          onClose={() => setShowMessage(false)}
        />
      )}
    </>
  );
}
