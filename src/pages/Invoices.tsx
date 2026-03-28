import AppLayout from "@/components/AppLayout";
import { useInvoices, useCreateInvoice, useDeleteInvoice, useUpdateInvoice, useClients } from "@/hooks/useCrmData";
import StatCard from "@/components/StatCard";
import { DollarSign, Clock, AlertTriangle, Trash2 } from "lucide-react";
import CrudDialog from "@/components/CrudDialog";

export default function Invoices() {
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();
  const createInvoice = useCreateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const updateInvoice = useUpdateInvoice();

  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const pending = invoices.filter(i => i.status === "pending").reduce((s, i) => s + Number(i.amount), 0);
  const overdue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + Number(i.amount), 0);

  const statusStyles: Record<string, string> = {
    paid: "bg-success/20 text-success",
    pending: "bg-warning/20 text-warning",
    overdue: "bg-destructive/20 text-destructive",
    draft: "bg-muted text-muted-foreground",
  };

  const invoiceFields = [
    { name: "invoice_number", label: "Invoice #", type: "text" as const, placeholder: "INV-007", required: true },
    { name: "client_id", label: "Client", type: "select" as const, options: clients.map(c => ({ value: c.id, label: c.name })) },
    { name: "amount", label: "Amount ($)", type: "number" as const, placeholder: "5000", required: true },
    { name: "status", label: "Status", type: "select" as const, options: [
      { value: "draft", label: "Draft" },
      { value: "pending", label: "Pending" },
      { value: "paid", label: "Paid" },
      { value: "overdue", label: "Overdue" },
    ]},
    { name: "due_date", label: "Due Date", type: "date" as const },
  ];

  return (
    <AppLayout title="Invoices" subtitle="Track payments and billing">
      <div className="mb-6 flex items-center justify-end">
        <CrudDialog
          title="Add Invoice"
          fields={invoiceFields}
          onSubmit={async (data) => {
            await createInvoice.mutateAsync({
              ...data,
              amount: data.amount ? Number(data.amount) : 0,
            } as any);
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={DollarSign} label="Paid" value={`$${paid.toLocaleString()}`} change={`${invoices.filter(i => i.status === "paid").length} invoices`} changeType="positive" />
        <StatCard icon={Clock} label="Pending" value={`$${pending.toLocaleString()}`} change={`${invoices.filter(i => i.status === "pending").length} invoices`} />
        <StatCard icon={AlertTriangle} label="Overdue" value={`$${overdue.toLocaleString()}`} change={`${invoices.filter(i => i.status === "overdue").length} invoices`} changeType="negative" />
      </div>

      {isLoading ? (
        <div className="mt-6 flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : invoices.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
          <p className="text-lg font-display font-semibold text-foreground">No invoices yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first invoice</p>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 font-medium text-muted-foreground">Invoice</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Client</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Due Date</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-6 py-4 font-display font-semibold text-foreground">{inv.invoice_number}</td>
                    <td className="px-6 py-4 text-foreground">{(inv as any).clients?.name || "—"}</td>
                    <td className="px-6 py-4 font-display font-semibold text-foreground">${Number(inv.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[inv.status] || ""}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CrudDialog
                          title="Invoice"
                          fields={invoiceFields}
                          mode="edit"
                          initialData={{
                            invoice_number: inv.invoice_number,
                            client_id: inv.client_id || "",
                            amount: String(inv.amount),
                            status: inv.status,
                            due_date: inv.due_date || "",
                          }}
                          onSubmit={async (data) => {
                            await updateInvoice.mutateAsync({
                              id: inv.id,
                              ...data,
                              amount: data.amount ? Number(data.amount) : 0,
                            } as any);
                          }}
                        />
                        <button onClick={() => deleteInvoice.mutate(inv.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
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
