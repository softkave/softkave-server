export type DataType = "string" | "number" | "array";

export interface IBulkUpdateById<T> {
  id: string;
  data: Partial<T>;
}
