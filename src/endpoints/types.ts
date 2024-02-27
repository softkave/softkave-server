import Joi = require('joi');
import {IStrippedOperationError} from '../utilities/OperationError';
import {AnyObject} from '../utilities/types';
import {IDataProvideQueryListParams} from './contexts/data/types';
import {IBaseContext} from './contexts/IBaseContext';
import RequestData from './RequestData';

export interface IBaseEndpointResult {
  errors?: IStrippedOperationError[];
}

// TODO: R (Result) should be put into data field in IBaseEndpointResult
export type Endpoint<
  TContext extends IBaseContext = IBaseContext,
  TParams = any,
  TResult extends AnyObject | void = void
> = (
  context: TContext,
  instData: RequestData<TParams>
) => Promise<
  TResult extends AnyObject ? IBaseEndpointResult & TResult : IBaseEndpointResult | TResult
>;

export type GetEndpointParam<TEndpoint> = TEndpoint extends Endpoint<any, infer P, any>
  ? P
  : undefined;
export type GetEndpointContext<TEndpoint> = TEndpoint extends Endpoint<infer C, any, any>
  ? C
  : undefined;
export type GetEndpointResult<TEndpoint> = TEndpoint extends Endpoint<any, any, infer R>
  ? R
  : undefined;

export type ExtractFieldTransformer<T, Result = any, ExtraArgs = any> = (
  val: T,
  extraArgs: ExtraArgs
) => Result;

export type ExtractFieldsDefaultScalarTypes =
  | undefined
  | boolean
  | string
  | number
  | bigint
  | symbol
  | null
  | Date;

export type ExtractFieldsFrom<
  T extends object,
  ScalarTypes = ExtractFieldsDefaultScalarTypes,
  ExtraArgs = undefined,
  Result extends Partial<Record<keyof T, any>> = T
> = {
  [Key in keyof Required<T>]: Required<T>[Key] extends ScalarTypes
    ? boolean | ExtractFieldTransformer<Required<T>[Key], Result[Key], ExtraArgs>
    : Required<T>[Key] extends any[]
    ? Required<T>[Key][number] extends ScalarTypes
      ? boolean | ExtractFieldTransformer<Required<T>[Key], Result[Key], ExtraArgs>
      : Required<T>[Key][number] extends object
      ? ExtractFieldsFrom<Required<T>[Key][number]>
      : boolean | ExtractFieldTransformer<Required<T>[Key][number], Result[Key], ExtraArgs>
    : Required<T>[Key] extends object
    ?
        | ExtractFieldsFrom<Required<T>[Key]>
        | ExtractFieldTransformer<Required<T>[Key], Result[Key], ExtraArgs>
    : boolean | ExtractFieldTransformer<Required<T>[Key], Result[Key], ExtraArgs>;
};

export interface IObjectPaths<
  T extends object,
  ExtraArgs = undefined,
  Result extends Partial<Record<keyof T, any>> = T
> {
  object: T;
  extraArgs: ExtraArgs;
  result: Result;
  scalarFields: string[];
  scalarFieldsWithTransformers: Array<{
    property: string;
    transformer: ExtractFieldTransformer<any>;
  }>;
  objectFields: Array<{
    property: string;
    fields: IObjectPaths<any>;
  }>;
}

export enum JWTTokenScope {
  ChangePassword = 'change-password',
  Login = 'login',
  Global = '*',
}

export enum ServerRecommendedActions {
  LOGIN_AGAIN = 'LOGIN_AGAIN',
  LOGOUT = 'LOGOUT',
}

export interface IUpdateComplexTypeArrayInput<T> {
  add?: T[];
  remove?: string[];
  update?: T[];
}

export interface IResourceWithId {
  customId: string;
}

export type GetMongoUpdateType<T> = Omit<T, 'customId' | 'createdAt' | 'createdBy'>;

export interface IPaginatedResult {
  page: number;
  pageSize: number;
  count: number;
}

export type IEndpointQueryPaginationOptions<T = any> = Pick<
  IDataProvideQueryListParams<T>,
  'page' | 'pageSize'
>;

export type IEndpointQuerySortOptions<T = any> = Pick<IDataProvideQueryListParams<T>, 'sort'>;
export type ValidationParts<T> = Record<keyof T, Joi.Schema>;
