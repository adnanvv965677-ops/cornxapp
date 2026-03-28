import AppLayout from "@/components/AppLayout";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, Trash2, Download, Loader2 } from "lucide-react";

export default function Documents() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("documents").list(user!.id, { sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(filePath, file);
    if (error) console.error(error);
    else qc.invalidateQueries({ queryKey: ["documents"] });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (name: string) => {
    if (!user) return;
    await supabase.storage.from("documents").remove([`${user.id}/${name}`]);
    qc.invalidateQueries({ queryKey: ["documents"] });
  };

  const handleDownload = async (name: string) => {
    if (!user) return;
    const { data } = await supabase.storage.from("documents").download(`${user.id}/${name}`);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getFileIcon = (name: string) => {
    return <FileText className="h-5 w-5 text-primary" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <AppLayout title="Documents" subtitle="Store contracts, assets, proposals, and files">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{files.length} files</p>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload File
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-lg font-display font-semibold text-foreground">No files yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload contracts, proposals, and assets</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => {
            const displayName = file.name.replace(/^\d+_/, "");
            return (
              <div key={file.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 card-glow">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  {getFileIcon(file.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" title={displayName}>{displayName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {file.metadata?.size ? formatSize(file.metadata.size) : "—"} · {new Date(file.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleDownload(file.name)} className="text-muted-foreground hover:text-primary transition-colors p-1"><Download className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(file.name)} className="text-muted-foreground hover:text-destructive transition-colors p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
