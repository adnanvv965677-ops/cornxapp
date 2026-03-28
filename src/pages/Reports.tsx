import AppLayout from "@/components/AppLayout";
import { useClients, useProjects, useInvoices, useTasks, useDeals } from "@/hooks/useCrmData";
import StatCard from "@/components/StatCard";
import { Users, FolderKanban, DollarSign, CheckSquare, TrendingUp, BarChart3 } from "lucide-react";

export default function Reports() {
  const { data: clients = [] } = useClients();
  const { data: projects = [] } = useProjects();
  const { data: invoices = [] } = useInvoices();
  const { data: tasks = [] } = useTasks();
  const { data: deals = [] } = useDeals();

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const pendingRevenue = invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);
  const pipelineValue = deals.filter(d => !["closed-won", "closed-lost"].includes(d.stage)).reduce((s, d) => s + Number(d.value), 0);
  const wonDeals = deals.filter(d => d.stage === "closed-won");
  const lostDeals = deals.filter(d => d.stage === "closed-lost");
  const completedProjects = projects.filter(p => p.status === "completed");
  const completedTasks = tasks.filter(t => t.status === "done");
  const activeClients = clients.filter(c => c.status === "active");
  const leads = clients.filter(c => c.status === "lead");

  return (
    <AppLayout title="Reports" subtitle="Revenue, clients, and project analytics">
      {/* Revenue */}
      <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Revenue Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change={`${invoices.filter(i => i.status === "paid").length} paid invoices`} changeType="positive" />
        <StatCard icon={DollarSign} label="Pending Revenue" value={`$${pendingRevenue.toLocaleString()}`} change={`${invoices.filter(i => i.status === "pending").length} pending`} changeType="negative" />
        <StatCard icon={TrendingUp} label="Pipeline Value" value={`$${pipelineValue.toLocaleString()}`} change={`${deals.filter(d => !["closed-won", "closed-lost"].includes(d.stage)).length} active deals`} />
        <StatCard icon={DollarSign} label="Won Deals" value={`$${wonDeals.reduce((s, d) => s + Number(d.value), 0).toLocaleString()}`} change={`${wonDeals.length} deals won`} changeType="positive" />
      </div>

      {/* Clients */}
      <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Client Analytics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={Users} label="Total Clients" value={String(clients.length)} change={`${activeClients.length} active`} />
        <StatCard icon={Users} label="Active Clients" value={String(activeClients.length)} change={`${Math.round((activeClients.length / (clients.length || 1)) * 100)}% of total`} changeType="positive" />
        <StatCard icon={Users} label="Leads" value={String(leads.length)} change="Potential conversions" />
        <StatCard icon={DollarSign} label="Avg Client Value" value={`$${clients.length ? Math.round(clients.reduce((s, c) => s + Number(c.total_spent), 0) / clients.length).toLocaleString() : "0"}`} change="Per client" />
      </div>

      {/* Projects & Tasks */}
      <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Project & Task Performance</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={FolderKanban} label="Total Projects" value={String(projects.length)} change={`${completedProjects.length} completed`} />
        <StatCard icon={FolderKanban} label="Completion Rate" value={`${projects.length ? Math.round((completedProjects.length / projects.length) * 100) : 0}%`} change={`${projects.filter(p => p.status === "in-progress").length} in progress`} changeType="positive" />
        <StatCard icon={CheckSquare} label="Total Tasks" value={String(tasks.length)} change={`${completedTasks.length} done`} />
        <StatCard icon={CheckSquare} label="Task Completion" value={`${tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%`} change={`${tasks.filter(t => t.status === "in-progress").length} in progress`} changeType="positive" />
      </div>

      {/* Deal Pipeline Summary */}
      <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Deal Pipeline Summary</h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Inquiry", key: "inquiry" },
            { label: "Discussion", key: "discussion" },
            { label: "Proposal", key: "proposal" },
            { label: "Negotiation", key: "negotiation" },
            { label: "Won", key: "closed-won" },
            { label: "Lost", key: "closed-lost" },
          ].map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            return (
              <div key={stage.key} className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">{stageDeals.length}</p>
                <p className="text-xs text-muted-foreground">{stage.label}</p>
                <p className="text-xs font-medium text-primary">${stageDeals.reduce((s, d) => s + Number(d.value), 0).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
