import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { useClients } from "@/hooks/useCrmData";
import { useProjects } from "@/hooks/useCrmData";
import { useInvoices } from "@/hooks/useCrmData";
import { useTasks } from "@/hooks/useCrmData";
import { Users, FolderKanban, DollarSign, CheckSquare, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: clients = [] } = useClients();
  const { data: projects = [] } = useProjects();
  const { data: invoices = [] } = useInvoices();
  const { data: tasks = [] } = useTasks();

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.amount), 0);
  const pendingAmount = invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + Number(i.amount), 0);
  const activeProjects = projects.filter(p => p.status !== "completed");
  const openTasks = tasks.filter(t => t.status !== "done");

  const statusColors: Record<string, string> = {
    "in-progress": "bg-primary/20 text-primary",
    "planning": "bg-secondary text-muted-foreground",
    "review": "bg-warning/20 text-warning",
    "completed": "bg-success/20 text-success",
  };

  const priorityColors: Record<string, string> = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-warning/20 text-warning",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <AppLayout title="Dashboard" subtitle="Welcome back — here's your overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12% this month" changeType="positive" />
        <StatCard icon={Clock} label="Pending Payments" value={`$${pendingAmount.toLocaleString()}`} change={`${invoices.filter(i => i.status === "pending").length} invoices`} changeType="negative" />
        <StatCard icon={FolderKanban} label="Active Projects" value={String(activeProjects.length)} change={`${projects.length} total`} />
        <StatCard icon={CheckSquare} label="Open Tasks" value={String(openTasks.length)} change={`${tasks.filter(t => t.status === "done").length} completed`} changeType="positive" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Active Projects</h2>
              <span className="text-xs text-muted-foreground">{activeProjects.length} projects</span>
            </div>
            <div className="space-y-4">
              {activeProjects.length === 0 && <p className="text-sm text-muted-foreground">No active projects yet. Create one to get started!</p>}
              {activeProjects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{project.name}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[project.status] || ""}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(project as any).clients?.name || "No client"} · Due {project.deadline ? new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24">
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-8 text-right">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Upcoming Tasks</h2>
              <span className="text-xs text-muted-foreground">{openTasks.length} pending</span>
            </div>
            <div className="space-y-3">
              {openTasks.length === 0 && <p className="text-sm text-muted-foreground">No pending tasks.</p>}
              {openTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityColors[task.priority] || ""}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{(task as any).projects?.name || "No project"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-foreground">Recent Clients</h2>
          <a href="/clients" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clients yet. Add your first client to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground">Company</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.slice(0, 4).map((client) => (
                  <tr key={client.id} className="transition-colors hover:bg-secondary/30">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {client.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{client.company}</td>
                    <td className="py-3">
                      <Badge variant={client.status === "active" ? "default" : client.status === "lead" ? "secondary" : "outline"} className="text-[10px]">
                        {client.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-medium text-foreground">${Number(client.total_spent).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
