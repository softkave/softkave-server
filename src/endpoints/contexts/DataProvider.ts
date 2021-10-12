export enum DataProviderFilterValueOperator {
    Equal,
    GreaterThan,
    GreaterThanOrEqual,
    In,
    LessThan,
    LessThanOrEqual,
    NotEqual,
    NotIn,
    Regex,
    Object,
    None,
}

export enum DataProviderFilterValueLogicalOperator {
    Not,
}

type ValueExpander<T> = Array<T> | T | null;
type GetValueType<Value> = Value extends any[]
    ? Value[0]
    : Value extends object
    ? Partial<Value>
    : Value;

export interface IDataProviderFilterValue<Value> {
    value: ValueExpander<GetValueType<Value>>;
    queryOp?: DataProviderFilterValueOperator;
    logicalOp?: DataProviderFilterValueLogicalOperator;
}

export enum DataProviderFilterCombineOperator {
    Or,
    And,
    Nor,
}

export type IDataProviderFilter<T extends object> = {
    items: Array<{ [K in keyof T]?: IDataProviderFilterValue<T[K]> }>;
    combineOp?: DataProviderFilterCombineOperator;
};

export interface IGetManyItemsOptions {
    limit?: number;
}

export interface IDataProvider<T extends object> {
    checkItemExists: (filter: IDataProviderFilter<T>) => Promise<boolean>;
    getItem: (filter: IDataProviderFilter<T>) => Promise<T | null>;
    getManyItems: (
        filter: IDataProviderFilter<T>,
        options?: IGetManyItemsOptions
    ) => Promise<Array<T>>;
    deleteItem: (filter: IDataProviderFilter<T>) => Promise<void>;
    updateItem: (
        filter: IDataProviderFilter<T>,
        data: Partial<T>
    ) => Promise<T | null>;
    bulkUpdateItems: (
        items: Array<{
            filter: IDataProviderFilter<T>;
            data: Partial<T>;
            updateFirstItemOnly?: boolean;
        }>
    ) => Promise<void>;
    assertUpdateItem: (
        filter: IDataProviderFilter<T>,
        data: Partial<T>,
        throwError?: () => void
    ) => Promise<T>;
    deleteManyItems: (filter: IDataProviderFilter<T>) => Promise<void>;
    bulkDeleteItems: (
        items: Array<{
            filter: IDataProviderFilter<T>;
            deleteFirstItemOnly?: boolean;
        }>
    ) => Promise<void>;
    assertItemExists: (
        filter: IDataProviderFilter<T>,
        throwError?: () => void
    ) => Promise<boolean>;
    assertGetItem: (
        filter: IDataProviderFilter<T>,
        throwError?: () => void
    ) => Promise<T>;
    saveItem: (data: T) => Promise<T>;
    bulkSaveItems: (data: T[]) => Promise<void>;
}
