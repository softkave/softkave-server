export interface IUpdateItemById<T> {
    id: string;
    data: Partial<T>;
}
