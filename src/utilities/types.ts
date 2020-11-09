export interface IUpdateItemById<T> {
    id: string;
    data: Partial<T>;
}

export type ConvertDatesToStrings<T extends object> = {
    [Key in keyof T]: T[Key] extends Date
        ? string
        : T[Key] extends any[]
        ? T[Key][0] extends Date
            ? string
            : T[Key][0] extends object
            ? ConvertDatesToStrings<T[Key][0]>
            : string
        : T[Key] extends object
        ? ConvertDatesToStrings<T[Key]>
        : string;
};
