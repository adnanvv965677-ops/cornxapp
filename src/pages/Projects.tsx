import AppLayout from "@/components/AppLayout";
import { useProjects, useCreateProject, useDeleteProject, useUpdateProject, useClients } from "@/hooks/useCrmData";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Trash2 } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";

export default function Projects() {
  const { data: projects = [], isLoading } = useProjects();
  const { data: clients = [] } = useClients();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const columns = [
    { key: "planning" as const, label: "Planning", color: "bg-muted-foreground" },
    { key: "in-progress" as const, label: "In Progress", color: "bg-primary" },
    { key: "review" as const, label: "Review", color: "bg-warning" },
    { key: "completed" as const, label: "Completed", color: "bg-success" },
  ];

  const projectFields = [
    { name: "name", label: "Project Name", type: "text" as const, placeholder: "Website Redesign", required: true },
    { name: "client_id", label: "Client", type: "select" as const, options: clients.map(c => ({ value: c.id, label: c.name })) },
    { name: "status", label: "Status", type: "select" as const, options: columns.map(c => ({ value: c.key, label: c.label })) },
    { name: "budget", label: "Budget ($)", type: "number" as const, placeholder: "10000" },
    { name: "deadline", label: "Deadline", type: "date" as const },
  ];

  return (
    <AppLayout title="Projects" subtitle="Track progress across all projects">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        <CrudDialog
          title="Add Project"
          fields={projectFields}
          onSubmit={async (data) => {
            await createProject.mutateAsync({
              ...data,
              budget: data.budget ? Number(data.budget) : 0,
            } as any);
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const colProjects = projects.filter(p => p.status === col.key);
            return (
              <div key={col.key}>
                <div className="mb-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className="ml-auto text-xs text-muted-foreground">{colProjects.length}</span>
                </div>
                <div className="space-y-3">
                  {colProjects.map((project) => (
                    <div key={project.id} className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 card-glow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display font-semibold text-foreground">{project.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{(project as any).clients?.name || "No client"}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CrudDialog
                            title="Project"
                            fields={projectFields}
                            mode="edit"
                            initialData={{
                              name: project.name,
                              client_id: project.client_id || "",
                              status: project.status,
                              budget: String(project.budget),
                              deadline: project.deadline || "",
                            }}
                            onSubmit={async (data) => {
                              await updateProject.mutateAsync({
                                id: project.id,
                                ...data,
                                budget: data.budget ? Number(data.budget) : 0,
                              } as any);
                            }}
                          />
                          <button onClick={() => deleteProject.mutate(project.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Progress value={project.progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{project.progress}%</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {project.deadline ? new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No deadline"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {Number(project.budget).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {colProjects.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">No projects</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
