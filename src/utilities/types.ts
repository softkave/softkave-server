export interface IUpdateItemById<T> {
  id: string;
  data: Partial<T>;
}

export type ConvertTypeOneToTypeTwo<T extends object, One, Two> = {
  [Key in keyof T]: NonNullable<T[Key]> extends One
    ? Two
    : T[Key] extends any[]
    ? NonNullable<T[Key][0]> extends One
      ? Two
      : T[Key][0] extends object
      ? ConvertTypeOneToTypeTwo<T[Key][0], One, Two>
      : T[Key][0]
    : NonNullable<T[Key]> extends object
    ? ConvertTypeOneToTypeTwo<NonNullable<T[Key]>, One, Two>
    : T[Key];
};

export type ConvertDatesToStrings<T extends object> = ConvertTypeOneToTypeTwo<T, Date, string>;
export type AnyFn<Args extends any[] = any[], Result = any> = (...args: Args) => Result;
export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type OrNull<T> = T | null;
export type Nullable<T> = {[K in keyof T]: T[K] | null};
export type Omit1<T, K extends keyof T> = Omit<T, K>;
export type AnyObject = {[k: string | number]: any};
export type PartialDepth<T> = {
  [K in keyof T]?: NonNullable<T[K]> extends AnyObject
    ? PartialDepth<NonNullable<T[K]>>
    : NonNullable<T[K]> extends Array<infer U>
    ? NonNullable<U> extends AnyObject
      ? Array<PartialDepth<NonNullable<U>>>
      : Array<U>
    : T[K];
};

export type ObjectValues<T> = T[keyof T];
