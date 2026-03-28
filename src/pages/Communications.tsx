import AppLayout from "@/components/AppLayout";
import { useCommunicationLogs, useCreateCommunicationLog, useDeleteCommunicationLog, useClients } from "@/hooks/useCrmData";
import { Phone, Mail, MessageSquare, Video, StickyNote, Trash2 } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";

const typeIcons: Record<string, any> = {
  call: Phone,
  email: Mail,
  message: MessageSquare,
  meeting: Video,
  note: StickyNote,
};

const typeColors: Record<string, string> = {
  call: "bg-success/20 text-success",
  email: "bg-primary/20 text-primary",
  message: "bg-warning/20 text-warning",
  meeting: "bg-accent/20 text-accent-foreground",
  note: "bg-muted text-muted-foreground",
};

export default function Communications() {
  const { data: logs = [], isLoading } = useCommunicationLogs();
  const { data: clients = [] } = useClients();
  const createLog = useCreateCommunicationLog();
  const deleteLog = useDeleteCommunicationLog();

  const logFields = [
    { name: "type", label: "Type", type: "select" as const, options: [
      { value: "call", label: "Call" },
      { value: "email", label: "Email" },
      { value: "message", label: "Message" },
      { value: "meeting", label: "Meeting" },
      { value: "note", label: "Note" },
    ], required: true },
    { name: "client_id", label: "Client", type: "select" as const, options: clients.map(c => ({ value: c.id, label: c.name })) },
    { name: "subject", label: "Subject", type: "text" as const, placeholder: "Follow-up call" },
    { name: "content", label: "Details", type: "text" as const, placeholder: "Discussed project timeline..." },
  ];

  return (
    <AppLayout title="Communications" subtitle="Log calls, emails, messages, and meetings">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{logs.length} entries</p>
        <CrudDialog title="Log Communication" fields={logFields} onSubmit={async (data) => { await createLog.mutateAsync(data as any); }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-display font-semibold text-foreground">No communication logs</p>
          <p className="mt-1 text-sm text-muted-foreground">Start logging your client interactions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const Icon = typeIcons[log.type] || StickyNote;
            return (
              <div key={log.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 card-glow">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[log.type] || "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{log.subject || log.type}</p>
                    <span className="text-[10px] text-muted-foreground">{new Date(log.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {log.content && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{log.content}</p>}
                  {(log as any).clients?.name && <p className="mt-1 text-xs text-primary">{(log as any).clients.name}</p>}
                </div>
                <button onClick={() => deleteLog.mutate(log.id)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
