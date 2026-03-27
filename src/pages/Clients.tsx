import AppLayout from "@/components/AppLayout";
import { useClients, useCreateClient, useDeleteClient } from "@/hooks/useCrmData";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2 } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";

const clientFields = [
  { name: "name", label: "Full Name", type: "text" as const, placeholder: "John Doe", required: true },
  { name: "email", label: "Email", type: "email" as const, placeholder: "john@company.com" },
  { name: "company", label: "Company", type: "text" as const, placeholder: "Acme Inc" },
  { name: "status", label: "Status", type: "select" as const, options: [
    { value: "lead", label: "Lead" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]},
];

export default function Clients() {
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();

  return (
    <AppLayout title="Clients" subtitle="Manage your client relationships">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{clients.length} clients</p>
        <CrudDialog
          title="Add Client"
          fields={clientFields}
          onSubmit={async (data) => { await createClient.mutateAsync(data as any); }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-display font-semibold text-foreground">No clients yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first client to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <div key={client.id} className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 card-glow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                    {client.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.company || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={client.status === "active" ? "default" : client.status === "lead" ? "secondary" : "outline"} className="text-[10px]">
                    {client.status}
                  </Badge>
                  <button onClick={() => deleteClient.mutate(client.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {client.email && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {client.email}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="font-display text-lg font-bold text-foreground">${Number(client.total_spent).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Contact</p>
                  <p className="text-xs font-medium text-foreground">
                    {client.last_contact ? new Date(client.last_contact).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
