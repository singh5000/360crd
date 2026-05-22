import type { FieldValues, UseFormReturn } from "react-hook-form";

export function mapFormData<T extends FieldValues, R>(values: T, mapper: (v: T) => R): R {
  return mapper(values);
}

export function buildDefaults<T extends FieldValues>(defaults: T, overrides?: Partial<T>): T {
  return { ...defaults, ...(overrides ?? {}) };
}

export async function resetForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  values?: Partial<T>,
) {
  form.reset(values as T);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
