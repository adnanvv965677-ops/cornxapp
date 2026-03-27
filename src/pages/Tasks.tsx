import AppLayout from "@/components/AppLayout";
import { mockTasks } from "@/data/mockData";
import { Calendar, Circle, CheckCircle2, Loader2 } from "lucide-react";

export default function Tasks() {
  const columns = [
    { key: "todo" as const, label: "To Do", icon: Circle, color: "text-muted-foreground" },
    { key: "in-progress" as const, label: "In Progress", icon: Loader2, color: "text-primary" },
    { key: "done" as const, label: "Done", icon: CheckCircle2, color: "text-success" },
  ];

  const priorityStyles: Record<string, string> = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-warning/20 text-warning",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <AppLayout title="Tasks" subtitle="Stay on top of your work">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((col) => {
          const tasks = mockTasks.filter(t => t.status === col.key);
          return (
            <div key={col.key}>
              <div className="mb-3 flex items-center gap-2">
                <col.icon className={`h-4 w-4 ${col.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                  {tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_hsl(43_65%_53%/0.08)]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{task.projectName}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
