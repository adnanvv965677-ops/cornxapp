import { useState, useEffect, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Loader2 } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface CrudDialogProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  trigger?: ReactNode;
  initialData?: Record<string, string>;
  mode?: "create" | "edit";
}

export default function CrudDialog({ title, fields, onSubmit, trigger, initialData, mode = "create" }: CrudDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    } else if (open && !initialData) {
      setFormData({});
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({});
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const defaultTrigger = mode === "edit" ? (
    <button className="text-muted-foreground hover:text-primary transition-colors">
      <Pencil className="h-3.5 w-3.5" />
    </button>
  ) : (
    <button className="flex items-center gap-2 rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
      <Plus className="h-4 w-4" />
      {title}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">{mode === "edit" ? `Edit ${title}` : title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
              {field.type === "select" ? (
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required={field.required}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg gold-gradient py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "edit" ? "Update" : "Save"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
