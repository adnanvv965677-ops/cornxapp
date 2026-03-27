import AppLayout from "@/components/AppLayout";
import { mockClients } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MoreVertical } from "lucide-react";

export default function Clients() {
  return (
    <AppLayout title="Clients" subtitle="Manage your client relationships">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockClients.map((client) => (
          <div key={client.id} className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_hsl(43_65%_53%/0.08)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                  {client.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.company}</p>
                </div>
              </div>
              <Badge variant={client.status === "active" ? "default" : client.status === "lead" ? "secondary" : "outline"} className="text-[10px]">
                {client.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {client.email}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-display text-lg font-bold text-foreground">${client.totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Contact</p>
                <p className="text-xs font-medium text-foreground">
                  {new Date(client.lastContact).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
