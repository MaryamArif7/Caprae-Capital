import { Lead } from "@/lib/types";

const STYLES: Record<Lead["score"], { label: string; className: string }> = {
  hot: { label: "Hot", className: "bg-connect-soft text-connect-ink" },
  warm: { label: "Warm", className: "bg-amber-soft text-amber" },
  cold: { label: "Cold", className: "bg-border/60 text-muted" },
};

export function ScoreBadge({ score }: { score: Lead["score"] }) {
  const { label, className } = STYLES[score];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
