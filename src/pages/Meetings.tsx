import AppLayout from "@/components/AppLayout";
import { useMeetings, useCreateMeeting, useDeleteMeeting, useUpdateMeeting, useClients, useProjects } from "@/hooks/useCrmData";
import { Calendar, Clock, Trash2, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CrudDialog from "@/components/CrudDialog";

export default function Meetings() {
  const { data: meetings = [], isLoading } = useMeetings();
  const { data: clients = [] } = useClients();
  const { data: projects = [] } = useProjects();
  const createMeeting = useCreateMeeting();
  const deleteMeeting = useDeleteMeeting();
  const updateMeeting = useUpdateMeeting();

  const meetingFields = [
    { name: "title", label: "Meeting Title", type: "text" as const, placeholder: "Project kickoff", required: true },
    { name: "client_id", label: "Client", type: "select" as const, options: clients.map(c => ({ value: c.id, label: c.name })) },
    { name: "project_id", label: "Project", type: "select" as const, options: projects.map(p => ({ value: p.id, label: p.name })) },
    { name: "meeting_date", label: "Date & Time", type: "date" as const, required: true },
    { name: "duration_minutes", label: "Duration (min)", type: "number" as const, placeholder: "60" },
    { name: "status", label: "Status", type: "select" as const, options: [
      { value: "scheduled", label: "Scheduled" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ]},
  ];

  const statusStyles: Record<string, string> = {
    scheduled: "bg-primary/20 text-primary",
    completed: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive",
  };

  const upcoming = meetings.filter(m => m.status === "scheduled" && new Date(m.meeting_date) >= new Date());
  const past = meetings.filter(m => m.status !== "scheduled" || new Date(m.meeting_date) < new Date());

  return (
    <AppLayout title="Meetings" subtitle="Schedule and track appointments">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{upcoming.length} upcoming · {meetings.length} total</p>
        <CrudDialog title="Add Meeting" fields={meetingFields} onSubmit={async (data) => {
          await createMeeting.mutateAsync({ ...data, duration_minutes: data.duration_minutes ? Number(data.duration_minutes) : 60 } as any);
        }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Video className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-lg font-display font-semibold text-foreground">No meetings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Schedule your first meeting</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} statusStyles={statusStyles}
                    meetingFields={meetingFields} clients={clients} projects={projects}
                    onUpdate={updateMeeting} onDelete={deleteMeeting} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-sm font-semibold text-muted-foreground">Past & Other</h2>
              <div className="space-y-3">
                {past.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} statusStyles={statusStyles}
                    meetingFields={meetingFields} clients={clients} projects={projects}
                    onUpdate={updateMeeting} onDelete={deleteMeeting} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

function MeetingCard({ meeting, statusStyles, meetingFields, clients, projects, onUpdate, onDelete }: any) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 card-glow">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary">
        <span className="text-xs font-bold text-primary">{new Date(meeting.meeting_date).toLocaleDateString("en-US", { month: "short" })}</span>
        <span className="text-lg font-bold text-foreground leading-none">{new Date(meeting.meeting_date).getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{meeting.title}</p>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[meeting.status] || ""}`}>{meeting.status}</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{meeting.duration_minutes || 60}min</span>
          {meeting.clients?.name && <span>{meeting.clients.name}</span>}
          {meeting.projects?.name && <span>· {meeting.projects.name}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <CrudDialog title="Meeting" fields={meetingFields} mode="edit"
          initialData={{ title: meeting.title, client_id: meeting.client_id || "", project_id: meeting.project_id || "", meeting_date: meeting.meeting_date?.split("T")[0] || "", duration_minutes: String(meeting.duration_minutes || 60), status: meeting.status }}
          onSubmit={async (data: any) => { await onUpdate.mutateAsync({ id: meeting.id, ...data, duration_minutes: data.duration_minutes ? Number(data.duration_minutes) : 60 } as any); }}
        />
        <button onClick={() => onDelete.mutate(meeting.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}
