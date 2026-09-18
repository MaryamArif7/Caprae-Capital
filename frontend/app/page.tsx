import { leads } from "@/lib/leads";
import { LeadsTable } from "@/components/LeadsTable";
import { ToastProvider } from "@/components/ToastProvider";

export default function Home() {
  const hotCount = leads.filter((l) => l.score === "hot").length;

  return (
    <ToastProvider>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">Leads</h1>
            <p className="text-sm text-muted">
              {leads.length} leads in your pipeline · {hotCount} marked hot
            </p>
          </div>
        </header>

        <LeadsTable leads={leads} />
      </main>
    </ToastProvider>
  );
}
