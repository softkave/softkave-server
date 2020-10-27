export type DataType = "string" | "number" | "array";

export interface IBulkUpdateByIdItem<T> {
    id: string;
    data: Partial<T>;
}
