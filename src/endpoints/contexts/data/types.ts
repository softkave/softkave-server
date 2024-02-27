import {ProjectionType, SortOrder} from 'mongoose';
import {AnyObject} from '../../../utilities/types';
import {IBaseContext} from '../IBaseContext';

export type DataQuerySort<T, K extends keyof T = keyof T> = {
  [P in K]?: SortOrder;
};

export interface IDataProvideQueryListParams<T> {
  page?: number;
  pageSize?: number;
  projection?: ProjectionType<T>;
  sort?: DataQuerySort<T>;
}

export type DataProviderLiteralType = string | number | boolean | null | undefined | Date;

// TODO: reclassify ops based on Mongo ops, but split comparison into number and other literals
export interface IComparisonLiteralFieldQueryOps<
  T extends DataProviderLiteralType = DataProviderLiteralType
> {
  $eq?: T;
  $in?: T extends string ? Array<T | RegExp> : Array<T>;
  $ne?: T;
  $nin?: T[];

  // TODO: implement $not and in which bracket should it go?
  // $not?: T;
  $exists?: boolean;
  $regex?: RegExp;
}

/**
 * Can also be used to query dates in Mongo.
 */
export interface INumberLiteralFieldQueryOps {
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
}

export type ILiteralFieldQueryOps<T = DataProviderLiteralType> = T extends DataProviderLiteralType
  ? (IComparisonLiteralFieldQueryOps<T> & INumberLiteralFieldQueryOps) | T
  : never;

type LiteralDataQuery<T> = {
  [P in keyof T]?: ILiteralFieldQueryOps<T[P]>;
};

export interface IRecordFieldQueryOps<T extends AnyObject> {
  // TODO: support nested $objMatch
  $objMatch: LiteralDataQuery<T>;
}

// TODO: support $objMatch in elemMatch
type ElemMatchQueryOp<T> = T extends AnyObject ? LiteralDataQuery<T> : ILiteralFieldQueryOps<T>;

export interface IArrayFieldQueryOps<T> {
  $size?: number;

  // TODO: support $objMatch and $elemMatch in $all
  $all?: T extends DataProviderLiteralType ? Array<ILiteralFieldQueryOps<T>> : never;
  $elemMatch?: ElemMatchQueryOp<T>;
}

export type DataQuery<T extends AnyObject> = {
  [P in keyof T]?: T[P] extends DataProviderLiteralType | Date
    ? ILiteralFieldQueryOps<T[P]>
    : NonNullable<T[P]> extends Array<infer U>
    ? IArrayFieldQueryOps<U>
    : NonNullable<T[P]> extends AnyObject
    ? IRecordFieldQueryOps<NonNullable<T[P]>>
    : void;
};

// TODO: infer resulting type from projection, otherwise default to full object
export interface IBaseDataProvider<
  T extends AnyObject,
  Q extends DataQuery<AnyObject> = DataQuery<T>
> {
  insertList: <T1 extends T = T>(ctx: IBaseContext, items: T1[]) => Promise<void>;
  getManyByQuery: <T1 extends Partial<T> = T, Q1 extends DataQuery<T1> = Q>(
    ctx: IBaseContext,
    q: Q1,
    p?: IDataProvideQueryListParams<T1>
  ) => Promise<T1[]>;
  getManyByQueries: <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q[],
    p?: IDataProvideQueryListParams<T>
  ) => Promise<T1[]>;
  getOneByQuery: <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q,
    p?: Pick<IDataProvideQueryListParams<T>, 'projection'>
  ) => Promise<T1 | null>;
  updateManyByQuery: (ctx: IBaseContext, q: Q, d: Partial<T>) => Promise<void>;
  updateOneByQuery: <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q,
    d: Partial<T>,
    p?: Pick<IDataProvideQueryListParams<T>, 'projection'>
  ) => Promise<void>;
  getAndUpdateOneByQuery: <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q,
    d: Partial<T>,
    p?: IDataProvideQueryListParams<T>
  ) => Promise<T1 | null>;
  existsByQuery: <Q1 extends Q = Q>(ctx: IBaseContext, q: Q1) => Promise<boolean>;
  countByQuery: <Q1 extends Q = Q>(ctx: IBaseContext, q: Q1) => Promise<number>;
  deleteManyByQuery: <Q1 extends Q = Q>(ctx: IBaseContext, q: Q1) => Promise<void>;
  deleteManyByQueries: <Q1 extends Q = Q>(ctx: IBaseContext, q: Q1[]) => Promise<void>;
  deleteOneByQuery: <Q1 extends Q = Q>(ctx: IBaseContext, q: Q1) => Promise<void>;
}
