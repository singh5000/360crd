import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus, GripVertical, Pencil, Trash2, RefreshCw, ToggleLeft, ToggleRight, Sliders,
  ShieldAlert, ClipboardCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ModuleDrawer } from "@/components/shared/ModuleDrawer";
import { cn } from "@/lib/utils";
import { http } from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated/app/form-fields")({
  head: () => ({ meta: [{ title: "Form Builder · 360CRD" }] }),
  component: FormBuilderPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType =
  | "TEXT" | "TEXTAREA" | "NUMBER" | "SELECT" | "MULTISELECT"
  | "CHECKBOX" | "DATE" | "URL" | "EMAIL" | "PHONE";

interface FieldOption { label: string; value: string; }

interface FormField {
  id: string;
  module: "incident" | "audit";
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string | null;
  helpText?: string | null;
  isRequired: boolean;
  isEnabled: boolean;
  options?: FieldOption[] | null;
  order: number;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "TEXT",        label: "Text" },
  { value: "TEXTAREA",    label: "Text Area" },
  { value: "NUMBER",      label: "Number" },
  { value: "SELECT",      label: "Dropdown (single)" },
  { value: "MULTISELECT", label: "Dropdown (multi)" },
  { value: "CHECKBOX",    label: "Checkbox" },
  { value: "DATE",        label: "Date" },
  { value: "EMAIL",       label: "Email" },
  { value: "PHONE",       label: "Phone" },
  { value: "URL",         label: "URL" },
];

const TYPE_BADGE: Record<FieldType, string> = {
  TEXT:        "bg-blue-500/10 text-blue-600",
  TEXTAREA:    "bg-indigo-500/10 text-indigo-600",
  NUMBER:      "bg-purple-500/10 text-purple-600",
  SELECT:      "bg-amber-500/10 text-amber-600",
  MULTISELECT: "bg-orange-500/10 text-orange-600",
  CHECKBOX:    "bg-teal-500/10 text-teal-600",
  DATE:        "bg-cyan-500/10 text-cyan-600",
  EMAIL:       "bg-pink-500/10 text-pink-600",
  PHONE:       "bg-rose-500/10 text-rose-600",
  URL:         "bg-green-500/10 text-green-600",
};

const EMPTY_FORM = {
  label: "", name: "", type: "TEXT" as FieldType,
  placeholder: "", helpText: "",
  isRequired: false, isEnabled: true,
  options: [] as FieldOption[],
};

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

// ── Field row with drag-and-drop ──────────────────────────────────────────────

function FieldRow({
  field, onEdit, onDelete, onToggle,
  onDragStart, onDragOver, onDrop, canManage,
}: {
  field: FormField;
  onEdit: (f: FormField) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (targetId: string) => void;
  canManage: boolean;
}) {
  return (
    <div
      draggable={canManage}
      onDragStart={() => canManage && onDragStart(field.id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(e); }}
      onDrop={() => canManage && onDrop(field.id)}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5 transition-colors hover:bg-card",
        !field.isEnabled && "opacity-50",
      )}
    >
      {canManage && (
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/40 group-hover:text-muted-foreground/80 active:cursor-grabbing" />
      )}

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{field.label}</p>
          <p className="truncate text-[11px] text-muted-foreground font-mono">{field.name}</p>
        </div>

        <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold", TYPE_BADGE[field.type])}>
          {field.type}
        </span>

        {field.isRequired && (
          <span className="shrink-0 rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-600">
            Required
          </span>
        )}

        {!field.isEnabled && (
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Disabled
          </span>
        )}
      </div>

      {canManage && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            title={field.isEnabled ? "Disable field" : "Enable field"}
            onClick={() => onToggle(field.id)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {field.isEnabled
              ? <ToggleRight className="h-4 w-4 text-green-500" />
              : <ToggleLeft className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => onEdit(field)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(field.id)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Field form (create / edit) ────────────────────────────────────────────────

function FieldForm({
  initial, module, onSave, saving,
}: {
  initial?: FormField | null;
  module: "incident" | "audit";
  onSave: (data: typeof EMPTY_FORM & { module: string }) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          label: initial.label,
          name: initial.name,
          type: initial.type,
          placeholder: initial.placeholder ?? "",
          helpText: initial.helpText ?? "",
          isRequired: initial.isRequired,
          isEnabled: initial.isEnabled,
          options: (initial.options ?? []) as FieldOption[],
        }
      : EMPTY_FORM,
  );

  const needsOptions = form.type === "SELECT" || form.type === "MULTISELECT";

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleLabelChange(val: string) {
    setForm((prev) => ({
      ...prev,
      label: val,
      name: initial ? prev.name : slugify(val),
    }));
  }

  function addOption() {
    set("options", [...form.options, { label: "", value: "" }]);
  }

  function updateOption(i: number, key: keyof FieldOption, val: string) {
    const opts = form.options.map((o, idx) =>
      idx === i ? { ...o, [key]: val, ...(key === "label" ? { value: slugify(val) } : {}) } : o,
    );
    set("options", opts);
  }

  function removeOption(i: number) {
    set("options", form.options.filter((_, idx) => idx !== i));
  }

  return (
    <form
      id="field-form"
      onSubmit={(e) => { e.preventDefault(); onSave({ ...form, module }); }}
      className="space-y-4"
    >
      {/* Module indicator — always show which form this field belongs to */}
      <div className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
        module === "incident"
          ? "border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-400"
          : "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400",
      )}>
        {module === "incident"
          ? <ShieldAlert className="h-4 w-4 shrink-0" />
          : <ClipboardCheck className="h-4 w-4 shrink-0" />}
        <span>
          This field will appear in the{" "}
          <strong>{module === "incident" ? "Incident Report" : "Audit"}</strong> form
        </span>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Label <span className="text-red-500">*</span>
        </Label>
        <Input
          value={form.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="e.g. Contractor Name"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Field Key (auto-generated)
        </Label>
        <Input
          value={form.name}
          onChange={(e) => set("name", e.target.value.replace(/[^a-z0-9_]/g, ""))}
          placeholder="contractor_name"
          className="font-mono text-xs"
          required
        />
        <p className="text-[11px] text-muted-foreground">Used as the key in form data. Lowercase, underscores only.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Field Type <span className="text-red-500">*</span>
        </Label>
        <Select value={form.type} onValueChange={(v) => set("type", v as FieldType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsOptions && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Options</Label>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={addOption}>
              <Plus className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="Label"
                  value={opt.label}
                  onChange={(e) => updateOption(i, "label", e.target.value)}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Value"
                  value={opt.value}
                  onChange={(e) => updateOption(i, "value", e.target.value)}
                  className="h-8 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="shrink-0 rounded p-1 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {form.options.length === 0 && (
              <p className="text-[11px] text-muted-foreground">No options yet — click Add to create one.</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Placeholder</Label>
        <Input
          value={form.placeholder}
          onChange={(e) => set("placeholder", e.target.value)}
          placeholder="e.g. Enter contractor name..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Help Text</Label>
        <Textarea
          value={form.helpText}
          onChange={(e) => set("helpText", e.target.value)}
          placeholder="Shown below the field as guidance..."
          rows={2}
        />
      </div>

      <div className="flex items-center gap-6 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
        <div className="flex flex-1 items-center gap-3">
          <Switch
            id="required"
            checked={form.isRequired}
            onCheckedChange={(v) => set("isRequired", v)}
          />
          <Label htmlFor="required" className="cursor-pointer text-sm">Required field</Label>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Switch
            id="enabled"
            checked={form.isEnabled}
            onCheckedChange={(v) => set("isEnabled", v)}
          />
          <Label htmlFor="enabled" className="cursor-pointer text-sm">Enabled</Label>
        </div>
      </div>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function FormBuilderPage() {
  const { user } = useAuth();
  const canManage = user?.role === "tenant_admin";

  const [activeTab, setActiveTab] = useState<"incident" | "audit">("incident");
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [saving, setSaving] = useState(false);

  const dragId = useRef<string | null>(null);

  const moduleFields = fields.filter((f) => f.module === activeTab);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.get<any>(ENDPOINTS.formFields.list);
      setFields(res.data?.data ?? []);
    } catch {
      toast.error("Failed to load form fields");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Drag-and-drop ────────────────────────────────────────────────────────
  function handleDragStart(id: string) { dragId.current = id; }

  function handleDrop(targetId: string) {
    if (!dragId.current || dragId.current === targetId) return;

    const currentModule = activeTab;
    const reordered = [...moduleFields];
    const fromIdx = reordered.findIndex((f) => f.id === dragId.current);
    const toIdx   = reordered.findIndex((f) => f.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const otherFields = fields.filter((f) => f.module !== currentModule);
    setFields([...otherFields, ...reordered]);

    http.put(ENDPOINTS.formFields.reorder, { ids: reordered.map((f) => f.id) })
      .catch(() => toast.error("Failed to save order"));

    dragId.current = null;
  }

  // ── Toggle ───────────────────────────────────────────────────────────────
  async function handleToggle(id: string) {
    try {
      const res = await http.put<any>(ENDPOINTS.formFields.toggle(id));
      setFields((prev) => prev.map((f) => f.id === id ? res.data.data : f));
    } catch {
      toast.error("Failed to toggle field");
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this custom field? Existing data will not be removed.")) return;
    try {
      await http.delete(ENDPOINTS.formFields.remove(id));
      setFields((prev) => prev.filter((f) => f.id !== id));
      toast.success("Field deleted");
    } catch {
      toast.error("Failed to delete field");
    }
  }

  // ── Save (create or update) ───────────────────────────────────────────────
  async function handleSave(data: any) {
    setSaving(true);
    try {
      if (editingField) {
        const res = await http.patch<any>(ENDPOINTS.formFields.update(editingField.id), data);
        setFields((prev) => prev.map((f) => f.id === editingField.id ? res.data.data : f));
        toast.success("Field updated");
      } else {
        const res = await http.post<any>(ENDPOINTS.formFields.create, data);
        setFields((prev) => [...prev, res.data.data]);
        toast.success("Field created");
      }
      setDrawerOpen(false);
      setEditingField(null);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save field");
    } finally {
      setSaving(false);
    }
  }

  function openCreate() { setEditingField(null); setDrawerOpen(true); }
  function openEdit(f: FormField) { setEditingField(f); setDrawerOpen(true); }

  return (
    <AppShell>
      <div className="mx-auto max-w-[900px] space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Sliders className="h-5 w-5 text-primary" />
              Form Builder
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add custom fields to the Incident and Audit forms. Drag rows to reorder.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            {canManage && (
              <Button
                size="sm"
                onClick={openCreate}
                className="gap-2 [background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
              >
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            )}
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex gap-1 rounded-lg border border-border/50 bg-muted/30 p-1 w-fit">
          {(["incident", "audit"] as const).map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setActiveTab(mod)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                activeTab === mod
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {mod === "incident" ? "Incident Fields" : "Audit Fields"}
              <span className={cn(
                "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                activeTab === mod ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}>
                {fields.filter((f) => f.module === mod).length}
              </span>
            </button>
          ))}
        </div>

        {/* Fields list */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : moduleFields.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 py-16">
            <Sliders className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 text-sm font-medium">No custom fields yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {canManage
                ? `Add fields to extend the ${activeTab} form.`
                : "No custom fields have been configured yet."}
            </p>
            {canManage && (
              <Button size="sm" onClick={openCreate} className="mt-4 gap-2 [background:var(--gradient-primary)] text-primary-foreground">
                <Plus className="h-4 w-4" /> Add First Field
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {moduleFields.map((field) => (
              <FieldRow
                key={field.id}
                field={field}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onDragStart={handleDragStart}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                canManage={canManage}
              />
            ))}
          </div>
        )}

        {!canManage && moduleFields.length > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Only managers and administrators can create or edit form fields.
          </p>
        )}
      </div>

      {/* Create / Edit drawer */}
      {canManage && (
        <ModuleDrawer
          open={drawerOpen}
          onOpenChange={(o) => { setDrawerOpen(o); if (!o) setEditingField(null); }}
          title={editingField
            ? `Edit ${editingField.module === "incident" ? "Incident" : "Audit"} Field`
            : `Add Field → ${activeTab === "incident" ? "Incident Report" : "Audit"}`}
          description={
            editingField
              ? "Update label, type, options or toggle required/enabled."
              : `Field will appear in the ${activeTab === "incident" ? "Incident Report" : "Audit"} create form.`
          }
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button
                form="field-form"
                type="submit"
                disabled={saving}
                className="[background:var(--gradient-primary)] text-primary-foreground hover:brightness-110"
              >
                {saving ? "Saving…" : editingField ? "Save Changes" : "Create Field"}
              </Button>
            </div>
          }
        >
          <FieldForm
            key={editingField?.id ?? "new"}
            initial={editingField}
            module={activeTab}
            onSave={handleSave}
            saving={saving}
          />
        </ModuleDrawer>
      )}
    </AppShell>
  );
}
