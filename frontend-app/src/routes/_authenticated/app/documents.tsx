import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, RefreshCw, FileText, FolderOpen, Upload,
  Download, Trash2, BookCheck, Archive,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { http } from "@/lib/api/axios";
import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FilterBar } from "@/components/shared/FilterBar";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePermissions } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated/app/documents")({
  head: () => ({ meta: [{ title: "Documents · 360CRD" }] }),
  component: DocumentsPage,
});

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     "bg-gray-500/10 text-gray-600 border-gray-500/20",
  PUBLISHED: "bg-green-500/10 text-green-600 border-green-500/20",
  ARCHIVED:  "bg-orange-500/10 text-orange-600 border-orange-500/20",
  EXPIRED:   "bg-red-500/10 text-red-600 border-red-500/20",
};

const DOC_CATEGORIES = [
  "POLICY", "PROCEDURE", "FORM", "RECORD", "PLAN", "REPORT", "REGISTER", "OTHER",
];

const FILTER_CONFIGS = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "DRAFT", label: "Draft" },
      { value: "PUBLISHED", label: "Published" },
      { value: "ARCHIVED", label: "Archived" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: DOC_CATEGORIES.map((c) => ({ value: c, label: c })),
  },
];

const EMPTY_FORM = { title: "", category: "POLICY", description: "" };

function formatBytes(bytes?: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const can = usePermissions();
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(ENDPOINTS.documents.list, { limit: 100 });
      setItems(res.data ?? []);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      if (q && !item.title.toLowerCase().includes(q) && !item.filename?.toLowerCase().includes(q)) return false;
      if (filterVals.status && filterVals.status !== "ALL" && item.status !== filterVals.status) return false;
      if (filterVals.category && filterVals.category !== "ALL" && item.category !== filterVals.category) return false;
      return true;
    });
  }, [items, search, filterVals]);

  const pills = [
    { label: "Total", value: items.length, icon: FileText, color: "text-foreground" },
    { label: "Published", value: items.filter((d) => d.status === "PUBLISHED").length, icon: FolderOpen, color: "text-green-500" },
  ];

  function resetDrawer() {
    setForm(EMPTY_FORM);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { toast.error("Please select a file to upload"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      // Metadata fields BEFORE the file so backend parses them in order
      fd.append("title", form.title || file.name);
      fd.append("category", form.category);
      if (form.description) fd.append("description", form.description);
      fd.append("file", file);

      await http.post(ENDPOINTS.documents.upload, fd);
      toast.success("Document uploaded successfully");
      setDrawerOpen(false);
      resetDrawer();
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to upload document");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownload(item: any) {
    try {
      const res = await http.get<any>(ENDPOINTS.documents.download(item.id));
      const { url, filename } = res.data?.data ?? {};
      if (!url) throw new Error("No URL returned");
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || item.filename || "download";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      toast.error("Failed to get download link");
    }
  }

  async function handlePublish(item: any) {
    try {
      await http.put(ENDPOINTS.documents.publish(item.id));
      toast.success("Document published");
      setItems((prev) => prev.map((d) => d.id === item.id ? { ...d, status: "PUBLISHED" } : d));
    } catch {
      toast.error("Failed to publish document");
    }
  }

  async function handleArchive(item: any) {
    try {
      await http.put(ENDPOINTS.documents.archive(item.id));
      toast.success("Document archived");
      setItems((prev) => prev.map((d) => d.id === item.id ? { ...d, status: "ARCHIVED" } : d));
    } catch {
      toast.error("Failed to archive document");
    }
  }

  async function handleDelete(item: any) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await http.delete(ENDPOINTS.documents.remove(item.id));
      toast.success("Document deleted");
      setItems((prev) => prev.filter((d) => d.id !== item.id));
    } catch {
      toast.error("Failed to delete document");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Documents</h1>
            <p className="mt-1 text-sm text-muted-foreground">Compliance and safety document library.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {can("document:create") && (
              <Button
                size="sm"
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
                onClick={() => setDrawerOpen(true)}
              >
                <Plus className="h-4 w-4" /> Upload Document
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2">
              <p.icon className={cn("h-3.5 w-3.5", p.color)} />
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="text-sm font-semibold">{p.value}</span>
            </div>
          ))}
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search documents..."
          filters={FILTER_CONFIGS}
          values={filterVals}
          onFilterChange={(key, val) => setFilterVals((prev) => ({ ...prev, [key]: val }))}
          onClear={() => { setSearch(""); setFilterVals({}); }}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">No documents found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || Object.values(filterVals).some((v) => v && v !== "ALL")
                ? "Try adjusting filters"
                : "No documents available yet"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Category</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs">File</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Version</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Size</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Uploaded</TableHead>
                  <TableHead className="w-[130px] text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow key={item.id} className="group border-border/60 hover:bg-muted/30">
                    <TableCell>
                      <p className="font-medium text-sm leading-snug">{item.title}</p>
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", STATUS_COLOR[item.status] ?? "bg-gray-500/10 text-gray-600")}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.category ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="max-w-[160px] truncate text-xs text-muted-foreground font-mono" title={item.filename}>
                        {item.filename ?? "—"}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {item.version ? `v${item.version}` : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {formatBytes(item.fileSize)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {/* Download */}
                        <button
                          type="button"
                          title="Download"
                          onClick={() => handleDownload(item)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>

                        {/* Publish (DRAFT only) */}
                        {can("document:update") && item.status === "DRAFT" && (
                          <button
                            type="button"
                            title="Publish"
                            onClick={() => handlePublish(item)}
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-green-500/10 hover:text-green-600"
                          >
                            <BookCheck className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Archive (PUBLISHED only) */}
                        {can("document:update") && item.status === "PUBLISHED" && (
                          <button
                            type="button"
                            title="Archive"
                            onClick={() => handleArchive(item)}
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-orange-500/10 hover:text-orange-600"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Delete */}
                        {can("document:delete") && (
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(item)}
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ModuleDrawer
        open={drawerOpen && can("document:create")}
        onOpenChange={(open) => { setDrawerOpen(open); if (!open) resetDrawer(); }}
        title="Upload Document"
        description="Upload a file to the document library"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              form="upload-doc-form-app"
              type="submit"
              disabled={submitting || !file}
              className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
            >
              <Upload className="h-4 w-4" />
              {submitting ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        }
      >
        <form id="upload-doc-form-app" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="app-doc-file">File <span className="text-red-500">*</span></Label>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground/50" />
              {file ? (
                <>
                  <p className="mt-2 text-sm font-medium text-foreground">{file.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Click to select a file</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground/70">PDF, Word, Excel, Images — up to 100 MB</p>
            </div>
            <input
              ref={fileInputRef}
              id="app-doc-file"
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f && !form.title) setForm((prev) => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, "") }));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-doc-title">Title</Label>
            <Input
              id="app-doc-title"
              placeholder="e.g. Work Health & Safety Policy"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-doc-category">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger id="app-doc-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOC_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-doc-desc">Description</Label>
            <Textarea
              id="app-doc-desc"
              placeholder="Brief description..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
        </form>
      </ModuleDrawer>
    </AppShell>
  );
}
