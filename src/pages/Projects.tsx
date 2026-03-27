import AppLayout from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign } from "lucide-react";

export default function Projects() {
  const columns = [
    { key: "planning" as const, label: "Planning", color: "bg-muted-foreground" },
    { key: "in-progress" as const, label: "In Progress", color: "bg-primary" },
    { key: "review" as const, label: "Review", color: "bg-warning" },
    { key: "completed" as const, label: "Completed", color: "bg-success" },
  ];

  return (
    <AppLayout title="Projects" subtitle="Track progress across all projects">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const projects = mockProjects.filter(p => p.status === col.key);
          return (
            <div key={col.key}>
              <div className="mb-3 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                <span className="ml-auto text-xs text-muted-foreground">{projects.length}</span>
              </div>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_hsl(43_65%_53%/0.08)]">
                    <p className="font-display font-semibold text-foreground">{project.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{project.clientName}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={project.progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium text-muted-foreground">{project.progress}%</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {project.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                    No projects
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
