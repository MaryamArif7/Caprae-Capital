import { Lead } from "@/lib/types";
import { LeadRow } from "./LeadRow";

const SCORE_ORDER: Record<Lead["score"], number> = { hot: 0, warm: 1, cold: 2 };

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const sorted = [...leads].sort((a, b) => SCORE_ORDER[a.score] - SCORE_ORDER[b.score]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-medium text-muted">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="px-4">
          {sorted.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
