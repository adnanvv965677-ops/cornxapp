import AppLayout from "@/components/AppLayout";
import { mockInvoices } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import { DollarSign, Clock, AlertTriangle, FileText } from "lucide-react";

export default function Invoices() {
  const paid = mockInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = mockInvoices.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const overdue = mockInvoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const statusStyles: Record<string, string> = {
    paid: "bg-success/20 text-success",
    pending: "bg-warning/20 text-warning",
    overdue: "bg-destructive/20 text-destructive",
    draft: "bg-muted text-muted-foreground",
  };

  return (
    <AppLayout title="Invoices" subtitle="Track payments and billing">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={DollarSign} label="Paid" value={`$${paid.toLocaleString()}`} change={`${mockInvoices.filter(i => i.status === "paid").length} invoices`} changeType="positive" />
        <StatCard icon={Clock} label="Pending" value={`$${pending.toLocaleString()}`} change={`${mockInvoices.filter(i => i.status === "pending").length} invoices`} />
        <StatCard icon={AlertTriangle} label="Overdue" value={`$${overdue.toLocaleString()}`} change={`${mockInvoices.filter(i => i.status === "overdue").length} invoices`} changeType="negative" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-4 font-medium text-muted-foreground">Invoice</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Client</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Amount</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Issued</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-6 py-4 font-display font-semibold text-foreground">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-foreground">{inv.clientName}</td>
                  <td className="px-6 py-4 font-display font-semibold text-foreground">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(inv.issuedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
