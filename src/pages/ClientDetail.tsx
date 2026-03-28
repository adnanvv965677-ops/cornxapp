import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useClient, useUpdateClient, useNotes, useCreateNote, useDeleteNote, useCommunicationLogs, useCreateCommunicationLog, useDeleteCommunicationLog, useActivityLogs } from "@/hooks/useCrmData";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building2, ArrowLeft, StickyNote, Clock, Trash2, Send } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";
import { useState } from "react";

const clientFields = [
  { name: "name", label: "Full Name", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "email" as const },
  { name: "phone", label: "Phone", type: "text" as const },
  { name: "company", label: "Company", type: "text" as const },
  { name: "status", label: "Status", type: "select" as const, options: [
    { value: "lead", label: "Lead" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]},
  { name: "lead_source", label: "Lead Source", type: "text" as const, placeholder: "Referral, Google, etc." },
];

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useClient(id);
  const updateClient = useUpdateClient();
  const { data: notes = [] } = useNotes("client", id);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const { data: commLogs = [] } = useCommunicationLogs(id);
  const createCommLog = useCreateCommunicationLog();
  const deleteCommLog = useDeleteCommunicationLog();
  const { data: activities = [] } = useActivityLogs("client", id);
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "communications" | "timeline">("notes");

  if (isLoading) return (
    <AppLayout title="Client" subtitle="Loading...">
      <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
    </AppLayout>
  );

  if (!client) return (
    <AppLayout title="Client Not Found" subtitle="">
      <Link to="/clients" className="text-primary hover:underline text-sm">← Back to Clients</Link>
    </AppLayout>
  );

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return;
    await createNote.mutateAsync({ entity_type: "client", entity_id: id, content: newNote });
    setNewNote("");
  };

  const commLogFields = [
    { name: "type", label: "Type", type: "select" as const, options: [
      { value: "call", label: "Call" },
      { value: "email", label: "Email" },
      { value: "message", label: "Message" },
      { value: "meeting", label: "Meeting" },
      { value: "note", label: "Note" },
    ], required: true },
    { name: "subject", label: "Subject", type: "text" as const },
    { name: "content", label: "Details", type: "text" as const },
  ];

  return (
    <AppLayout title={client.name} subtitle={client.company || "Client Profile"}>
      <div className="mb-6">
        <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to Clients
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
              {client.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">{client.name}</h2>
              <Badge variant={client.status === "active" ? "default" : client.status === "lead" ? "secondary" : "outline"} className="text-[10px]">{client.status}</Badge>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {client.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{client.email}</div>}
            {(client as any).phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{(client as any).phone}</div>}
            {client.company && <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" />{client.company}</div>}
            {(client as any).lead_source && <div className="flex items-center gap-2 text-muted-foreground"><span className="text-xs">Source:</span> {(client as any).lead_source}</div>}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-display text-lg font-bold text-foreground">${Number(client.total_spent).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Contact</p>
                <p className="text-sm font-medium text-foreground">{client.last_contact ? new Date(client.last_contact).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <CrudDialog title="Client" fields={clientFields} mode="edit"
              initialData={{ name: client.name, email: client.email || "", phone: (client as any).phone || "", company: client.company || "", status: client.status, lead_source: (client as any).lead_source || "" }}
              onSubmit={async (data) => { await updateClient.mutateAsync({ id: client.id, ...data } as any); }}
              trigger={<button className="w-full rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Edit Profile</button>}
            />
          </div>

          {(client as any).notes && (
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Client Notes</p>
              <p className="text-sm text-foreground">{(client as any).notes}</p>
            </div>
          )}
        </div>

        {/* Tabs: Notes, Communications, Timeline */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1">
            {(["notes", "communications", "timeline"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors capitalize ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "notes" && (
            <div>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                />
                <button onClick={handleAddNote} className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {notes.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No notes yet</p>}
                {notes.map((note) => (
                  <div key={note.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <StickyNote className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{note.content}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <button onClick={() => deleteNote.mutate(note.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0"><Trash2 className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "communications" && (
            <div>
              <div className="mb-4">
                <CrudDialog title="Log Communication" fields={commLogFields}
                  onSubmit={async (data) => { await createCommLog.mutateAsync({ ...data, client_id: id } as any); }}
                />
              </div>
              <div className="space-y-3">
                {commLogs.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No communication logs</p>}
                {commLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <span className="text-[10px] font-bold text-primary uppercase">{log.type}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{log.subject || log.type}</p>
                      {log.content && <p className="mt-0.5 text-xs text-muted-foreground">{log.content}</p>}
                      <p className="mt-1 text-[10px] text-muted-foreground">{new Date(log.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <button onClick={() => deleteCommLog.mutate(log.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0"><Trash2 className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-3">
              {activities.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No activity recorded</p>}
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="w-px flex-1 bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    {activity.description && <p className="text-xs text-muted-foreground">{activity.description}</p>}
                    <p className="mt-1 text-[10px] text-muted-foreground">{new Date(activity.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
