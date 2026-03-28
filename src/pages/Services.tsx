import AppLayout from "@/components/AppLayout";
import { useServices, useCreateService, useDeleteService, useUpdateService } from "@/hooks/useCrmData";
import { DollarSign, Clock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CrudDialog from "@/components/CrudDialog";

const serviceFields = [
  { name: "name", label: "Service Name", type: "text" as const, placeholder: "Web Development", required: true },
  { name: "description", label: "Description", type: "text" as const, placeholder: "Full-stack web application development" },
  { name: "price", label: "Price ($)", type: "number" as const, placeholder: "5000", required: true },
  { name: "duration_estimate", label: "Duration Estimate", type: "text" as const, placeholder: "2-4 weeks" },
  { name: "status", label: "Status", type: "select" as const, options: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]},
];

export default function Services() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const updateService = useUpdateService();

  return (
    <AppLayout title="Services" subtitle="Define your service offerings and pricing">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{services.length} services</p>
        <CrudDialog title="Add Service" fields={serviceFields} onSubmit={async (data) => { await createService.mutateAsync({ ...data, price: data.price ? Number(data.price) : 0 } as any); }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-display font-semibold text-foreground">No services yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Define your service packages</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 card-glow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-semibold text-foreground">{service.name}</p>
                  {service.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{service.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={service.status === "active" ? "default" : "outline"} className="text-[10px]">{service.status}</Badge>
                  <CrudDialog title="Service" fields={serviceFields} mode="edit"
                    initialData={{ name: service.name, description: service.description || "", price: String(service.price), duration_estimate: service.duration_estimate || "", status: service.status }}
                    onSubmit={async (data) => { await updateService.mutateAsync({ id: service.id, ...data, price: data.price ? Number(data.price) : 0 } as any); }}
                  />
                  <button onClick={() => deleteService.mutate(service.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1 text-foreground">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-display text-lg font-bold">${Number(service.price).toLocaleString()}</span>
                </div>
                {service.duration_estimate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {service.duration_estimate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
