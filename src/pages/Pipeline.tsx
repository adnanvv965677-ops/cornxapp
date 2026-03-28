import AppLayout from "@/components/AppLayout";
import { useDeals, useCreateDeal, useDeleteDeal, useUpdateDeal, useClients } from "@/hooks/useCrmData";
import { DollarSign, Trash2 } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";

const stages = [
  { key: "inquiry", label: "Inquiry", color: "bg-muted-foreground" },
  { key: "discussion", label: "Discussion", color: "bg-primary" },
  { key: "proposal", label: "Proposal", color: "bg-warning" },
  { key: "negotiation", label: "Negotiation", color: "bg-accent" },
  { key: "closed-won", label: "Closed Won", color: "bg-success" },
  { key: "closed-lost", label: "Closed Lost", color: "bg-destructive" },
];

export default function Pipeline() {
  const { data: deals = [], isLoading } = useDeals();
  const { data: clients = [] } = useClients();
  const createDeal = useCreateDeal();
  const deleteDeal = useDeleteDeal();
  const updateDeal = useUpdateDeal();

  const dealFields = [
    { name: "title", label: "Deal Title", type: "text" as const, placeholder: "Website project", required: true },
    { name: "client_id", label: "Client", type: "select" as const, options: clients.map(c => ({ value: c.id, label: c.name })) },
    { name: "value", label: "Value ($)", type: "number" as const, placeholder: "10000" },
    { name: "stage", label: "Stage", type: "select" as const, options: stages.map(s => ({ value: s.key, label: s.label })) },
    { name: "expected_close_date", label: "Expected Close", type: "date" as const },
  ];

  return (
    <AppLayout title="Pipeline" subtitle="Track deals through every stage">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{deals.length} deals · ${deals.reduce((s, d) => s + Number(d.value), 0).toLocaleString()} total value</p>
        <CrudDialog title="Add Deal" fields={dealFields} onSubmit={async (data) => { await createDeal.mutateAsync({ ...data, value: data.value ? Number(data.value) : 0 } as any); }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {stages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            const stageValue = stageDeals.reduce((s, d) => s + Number(d.value), 0);
            return (
              <div key={stage.key}>
                <div className="mb-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <h3 className="text-xs font-semibold text-foreground">{stage.label}</h3>
                  <span className="ml-auto text-[10px] text-muted-foreground">${stageValue.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 card-glow">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm font-medium text-foreground truncate">{deal.title}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          <CrudDialog title="Deal" fields={dealFields} mode="edit"
                            initialData={{ title: deal.title, client_id: deal.client_id || "", value: String(deal.value), stage: deal.stage, expected_close_date: deal.expected_close_date || "" }}
                            onSubmit={async (data) => { await updateDeal.mutateAsync({ id: deal.id, ...data, value: data.value ? Number(data.value) : 0 } as any); }}
                          />
                          <button onClick={() => deleteDeal.mutate(deal.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{(deal as any).clients?.name || "No client"}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-semibold text-foreground"><DollarSign className="h-3 w-3" />{Number(deal.value).toLocaleString()}</span>
                        <span className="text-muted-foreground">{deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && <div className="rounded-xl border border-dashed border-border p-6 text-center text-[11px] text-muted-foreground">No deals</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
