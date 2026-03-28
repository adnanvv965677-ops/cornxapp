import AppLayout from "@/components/AppLayout";
import { useTasks, useCreateTask, useDeleteTask, useUpdateTask, useProjects } from "@/hooks/useCrmData";
import { Calendar, Circle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";

export default function Tasks() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

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

  const taskFields = [
    { name: "title", label: "Task Title", type: "text" as const, placeholder: "Design homepage", required: true },
    { name: "project_id", label: "Project", type: "select" as const, options: projects.map(p => ({ value: p.id, label: p.name })) },
    { name: "priority", label: "Priority", type: "select" as const, options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ]},
    { name: "status", label: "Status", type: "select" as const, options: [
      { value: "todo", label: "To Do" },
      { value: "in-progress", label: "In Progress" },
      { value: "done", label: "Done" },
    ]},
    { name: "due_date", label: "Due Date", type: "date" as const },
  ];

  return (
    <AppLayout title="Tasks" subtitle="Stay on top of your work">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
        <CrudDialog
          title="Add Task"
          fields={taskFields}
          onSubmit={async (data) => { await createTask.mutateAsync(data as any); }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col.key);
            return (
              <div key={col.key}>
                <div className="mb-3 flex items-center gap-2">
                  <col.icon className={`h-4 w-4 ${col.color}`} />
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <div key={task.id} className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 card-glow">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityStyles[task.priority] || ""}`}>
                            {task.priority}
                          </span>
                          <CrudDialog
                            title="Task"
                            fields={taskFields}
                            mode="edit"
                            initialData={{
                              title: task.title,
                              project_id: task.project_id || "",
                              priority: task.priority,
                              status: task.status,
                              due_date: task.due_date || "",
                            }}
                            onSubmit={async (data) => {
                              await updateTask.mutateAsync({ id: task.id, ...data } as any);
                            }}
                          />
                          <button onClick={() => deleteTask.mutate(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{(task as any).projects?.name || "No project"}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date"}
                        </div>
                        {col.key !== "done" && (
                          <button
                            onClick={() => updateTask.mutate({ id: task.id, status: col.key === "todo" ? "in-progress" : "done" })}
                            className="text-[10px] font-medium text-primary hover:underline"
                          >
                            {col.key === "todo" ? "Start →" : "Done ✓"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">No tasks</div>
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
