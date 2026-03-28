import AppLayout from "@/components/AppLayout";
import { useContacts, useCreateContact, useDeleteContact, useUpdateContact } from "@/hooks/useCrmData";
import { Phone, Mail, Building2, Trash2, Search } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const contactFields = [
  { name: "name", label: "Full Name", type: "text" as const, placeholder: "Jane Smith", required: true },
  { name: "email", label: "Email", type: "email" as const, placeholder: "jane@company.com" },
  { name: "phone", label: "Phone", type: "text" as const, placeholder: "+1 555-0123" },
  { name: "company", label: "Company", type: "text" as const, placeholder: "Acme Inc" },
  { name: "role", label: "Role / Title", type: "text" as const, placeholder: "CEO" },
  { name: "type", label: "Type", type: "select" as const, options: [
    { value: "client", label: "Client" },
    { value: "vendor", label: "Vendor" },
    { value: "partner", label: "Partner" },
    { value: "other", label: "Other" },
  ]},
];

export default function Contacts() {
  const { data: contacts = [], isLoading } = useContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const typeColors: Record<string, string> = {
    client: "default",
    vendor: "secondary",
    partner: "outline",
    other: "outline",
  };

  return (
    <AppLayout title="Contacts" subtitle="Your centralized contact directory">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <CrudDialog title="Add Contact" fields={contactFields} onSubmit={async (data) => { await createContact.mutateAsync(data as any); }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-display font-semibold text-foreground">{search ? "No results" : "No contacts yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{search ? "Try a different search" : "Add your first contact"}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Company</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Contact</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((contact) => (
                  <tr key={contact.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        {contact.role && <p className="text-xs text-muted-foreground">{contact.role}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{contact.company || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {contact.email && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{contact.email}</div>}
                        {contact.phone && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{contact.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={typeColors[contact.type] as any || "outline"} className="text-[10px]">{contact.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CrudDialog title="Contact" fields={contactFields} mode="edit"
                          initialData={{ name: contact.name, email: contact.email || "", phone: contact.phone || "", company: contact.company || "", role: contact.role || "", type: contact.type }}
                          onSubmit={async (data) => { await updateContact.mutateAsync({ id: contact.id, ...data } as any); }}
                        />
                        <button onClick={() => deleteContact.mutate(contact.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
