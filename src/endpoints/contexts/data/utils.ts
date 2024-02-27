import {isNumber, isObject, isObjectLike} from 'lodash';
import {FilterQuery} from 'mongoose';
import MongoModel from '../../../mongo/MongoModel';
import {cast} from '../../../utilities/fns';
import {AnyObject} from '../../../utilities/types';
import {endpointConstants} from '../../constants';
import {IBaseContext} from '../IBaseContext';
import {IContextMongoDbModels} from '../types';
import {
  DataProviderLiteralType,
  DataQuery,
  IArrayFieldQueryOps,
  IBaseDataProvider,
  IComparisonLiteralFieldQueryOps,
  IDataProvideQueryListParams,
  INumberLiteralFieldQueryOps,
  IRecordFieldQueryOps,
} from './types';

export function getMongoQueryOptionsForOne(p?: IDataProvideQueryListParams<any>) {
  return {
    lean: true,
    projection: p?.projection,
  };
}

export function getMongoQueryOptionsForMany(p?: IDataProvideQueryListParams<any>) {
  const inputPage = p?.page;
  const inputPageSize = p?.pageSize;
  const pageSize = isNumber(inputPageSize)
    ? Math.max(inputPageSize, 0)
    : isNumber(inputPage)
    ? endpointConstants.maxPageSize
    : undefined;
  const skip = isNumber(inputPage) && pageSize ? Math.min(inputPage, 0) * pageSize : undefined;
  return {
    skip,
    limit: pageSize,
    lean: true,
    projection: p?.projection,
    sort: p?.sort,
  };
}

export abstract class BaseMongoDataProvider<
  T extends AnyObject,
  Q extends DataQuery<AnyObject> = DataQuery<T>
> implements IBaseDataProvider<T, Q>
{
  abstract mongoModelName: keyof IContextMongoDbModels;

  insertList = async (ctx: IBaseContext, items: T[]) => {
    await this.getMongoModel(ctx).model.insertMany(items);
  };

  getManyByQuery = async <T1 extends Partial<T> = T, Q1 extends DataQuery<T1> = Q>(
    ctx: IBaseContext,
    q: Q1,
    p?: IDataProvideQueryListParams<T1>
  ) => {
    const opts = getMongoQueryOptionsForMany(p);
    const items = await this.getMongoModel(ctx)
      .model.find(BaseMongoDataProvider.getMongoQuery(q), p?.projection, opts)
      .lean()
      .exec();
    return items as unknown as T1[];
  };

  getManyByQueries = async <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q[],
    p?: IDataProvideQueryListParams<T>
  ) => {
    const items = await this.getMongoModel(ctx)
      .model.find(
        {$or: q.map(next => BaseMongoDataProvider.getMongoQuery(next))},
        p?.projection,
        getMongoQueryOptionsForMany(p)
      )
      .lean()
      .exec();
    return items as unknown as T1[];
  };

  getOneByQuery = async <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q,
    p?: IDataProvideQueryListParams<T>
  ) => {
    const item = await this.getMongoModel(ctx)
      .model.findOne(BaseMongoDataProvider.getMongoQuery(q), p?.projection)
      .lean()
      .exec();
    return item as unknown as T1 | null;
  };

  updateManyByQuery = async (ctx: IBaseContext, q: Q, d: Partial<T>) => {
    await this.getMongoModel(ctx)
      .model.updateMany(BaseMongoDataProvider.getMongoQuery(q), d)
      .exec();
  };

  updateOneByQuery = async (ctx: IBaseContext, q: Q, d: Partial<T>) => {
    await this.getMongoModel(ctx).model.updateOne(BaseMongoDataProvider.getMongoQuery(q), d).exec();
  };

  getAndUpdateOneByQuery = async <T1 extends Partial<T> = T>(
    ctx: IBaseContext,
    q: Q,
    d: Partial<T>,
    p?: IDataProvideQueryListParams<T>
  ) => {
    const item = await this.getMongoModel(ctx)
      .model.findOneAndUpdate(BaseMongoDataProvider.getMongoQuery(q), d, {
        ...getMongoQueryOptionsForOne(p),
        new: true,
      })
      .exec();
    return item as unknown as T1 | null;
  };

  existsByQuery = async (ctx: IBaseContext, q: Q) => {
    return !!(await this.getMongoModel(ctx)
      .model.exists(BaseMongoDataProvider.getMongoQuery(q))
      .lean()
      .exec());
  };

  countByQuery = async (ctx: IBaseContext, q: Q) => {
    return await this.getMongoModel(ctx)
      .model.countDocuments(BaseMongoDataProvider.getMongoQuery(q))
      .exec();
  };

  deleteManyByQuery = async (ctx: IBaseContext, q: Q) => {
    await this.getMongoModel(ctx).model.deleteMany(BaseMongoDataProvider.getMongoQuery(q)).exec();
  };

  deleteManyByQueries = async (ctx: IBaseContext, q: Q[]) => {
    await this.getMongoModel(ctx)
      .model.deleteMany({$or: q.map(next => BaseMongoDataProvider.getMongoQuery(next))})
      .exec();
  };

  deleteOneByQuery = async (ctx: IBaseContext, q: Q) => {
    await this.getMongoModel(ctx).model.deleteOne(BaseMongoDataProvider.getMongoQuery(q)).exec();
  };

  static getMongoQuery<
    Q extends DataQuery<AnyObject>,
    DataType = Q extends DataQuery<infer U> ? U : AnyObject
  >(q: Q) {
    type T = IComparisonLiteralFieldQueryOps &
      INumberLiteralFieldQueryOps &
      IArrayFieldQueryOps<any> &
      IRecordFieldQueryOps<any>;
    const mq: FilterQuery<DataType> = {};
    for (const k in q) {
      const v = q[k];
      if (isQueryBaseLiteralFn(v)) mq[k] = v;
      else if (isObject(v)) {
        const vops = Object.keys(v) as Array<keyof T>;
        for (const vop of vops) {
          switch (vop) {
            case '$objMatch': {
              const vWithObjMatch = cast<IRecordFieldQueryOps<any>>(v);
              const objMatchValue = vWithObjMatch['$objMatch'];
              Object.keys(objMatchValue).forEach(f => {
                mq[`${k}.${f}`] = objMatchValue[f];
              });
              break;
            }
            default:
              mq[k] = v;
          }
        }
      }
    }
    return mq;
  }

  protected getMongoModel(ctx: IBaseContext) {
    return ctx.models[this.mongoModelName] as MongoModel<any>;
  }
}

export function isQueryBaseLiteralFn(q: any): q is DataProviderLiteralType {
  return !isObjectLike(q);
}

/**
 * Runs avery simple loop over the fields in the object and if any field's value
 * is not "object-like," it turns it into a `$eq` query op. If this is not the
 * behaviour you're looking for, consider updating the logic and this comment or
 * create another function.
 */
export function toDataQuery<T extends AnyObject, Q extends DataQuery<any> = DataQuery<any>>(d: T) {
  return Object.keys(d).reduce((q, k) => {
    const v = d[k];
    if (!isObjectLike(v)) q[k] = {$eq: v};
    return q;
  }, {} as AnyObject) as Q;
}
