import { forEach } from "lodash";
import { Document, FilterQuery } from "mongoose";
import MongoModel from "../../mongo/MongoModel";
import { cast } from "../../utilities/fns";
import { wrapFireAndThrowErrorAsync } from "../utils";
import {
    IDataProvider,
    DataProviderFilterValueOperator,
    DataProviderFilterValueLogicalOperator,
    DataProviderFilterCombineOperator,
    IDataProviderFilter,
    IGetManyItemsOptions,
} from "./DataProvider";

export default class MongoDataProvider<T extends object>
    implements IDataProvider<T>
{
    constructor(
        private model: MongoModel<Document<T>>,
        private throwNotFound?: () => void
    ) {}

    checkItemExists = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            return await this.model.model.exists(mongoQuery);
        }
    );

    getItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            const item = await this.model.model
                .findOne(mongoQuery)
                .lean()
                .exec();
            return cast<T | null>(item);
        }
    );

    getManyItems = wrapFireAndThrowErrorAsync(
        async (
            filter: IDataProviderFilter<T>,
            options?: IGetManyItemsOptions
        ) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            const items = await this.model.model.find(mongoQuery).lean().exec();
            return cast<T[]>(items);
        }
    );

    deleteItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            await this.model.model.deleteOne(mongoQuery).exec();
        }
    );

    deleteManyItems = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            await this.model.model.deleteMany(mongoQuery).exec();
        }
    );

    updateItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>, data: Partial<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            const item = await this.model.model
                .findOneAndUpdate(mongoQuery, data, { new: true })
                .lean()
                .exec();
            return cast<T | null>(item);
        }
    );

    assertItemExists = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>, throwError?: () => void) => {
            const item = await this.getItem(filter);

            if (!item) {
                if (throwError) {
                    throwError();
                } else if (this.throwNotFound) {
                    this.throwNotFound();
                }
            }

            return true;
        }
    );

    assertGetItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>, throwError?: () => void) => {
            const item = await this.getItem(filter);

            if (!item) {
                if (throwError) {
                    throwError();
                } else if (this.throwNotFound) {
                    this.throwNotFound();
                }
            }

            return cast<T>(item);
        }
    );

    assertUpdateItem = wrapFireAndThrowErrorAsync(
        async (
            filter: IDataProviderFilter<T>,
            data: Partial<T>,
            throwError?: () => void
        ) => {
            const item = await this.updateItem(filter, data);

            if (!item) {
                if (throwError) {
                    throwError();
                } else if (this.throwNotFound) {
                    this.throwNotFound();
                }
            }

            return cast<T>(item);
        }
    );

    saveItem = wrapFireAndThrowErrorAsync(async (data: T) => {
        const item = new this.model.model(data);
        const savedItem = await item.save();
        return cast<T>(savedItem);
    });

    bulkSaveItems = wrapFireAndThrowErrorAsync(async (data: T[]) => {
        await this.model.model.insertMany(data);
    });

    bulkDeleteItems = wrapFireAndThrowErrorAsync(
        async (
            items: Array<{
                filter: IDataProviderFilter<T>;
                deleteFirstItemOnly?: boolean;
            }>
        ) => {
            await this.model.model.bulkWrite(
                items.map((item) => ({
                    [item.deleteFirstItemOnly ? "deleteOne" : "deleteMany"]: {
                        filter: getMongoQueryFromFilter(item.filter),
                    },
                }))
            );
        }
    );

    bulkUpdateItems = wrapFireAndThrowErrorAsync(
        async (
            items: Array<{
                filter: IDataProviderFilter<T>;
                data: Partial<T>;
                updateFirstItemOnly?: boolean;
            }>
        ) => {
            await this.model.model.bulkWrite(
                items.map((item) => ({
                    [item.updateFirstItemOnly ? "updateOne" : "updateMany"]: {
                        filter: getMongoQueryFromFilter(item.filter),
                        update: item.data,
                    },
                }))
            );
        }
    );
}

export function getMongoQueryFromFilter(filter: IDataProviderFilter<any>) {
    const queries: Array<FilterQuery<any>> = filter.items.map((item) => {
        const itemMongoQuery: FilterQuery<any> = {};

        forEach(item, (value, key) => {
            let valueMongoQuery: FilterQuery<any> = {};

            switch (value.queryOp) {
                case DataProviderFilterValueOperator.GreaterThan:
                    valueMongoQuery = { $gt: value.value };
                    break;
                case DataProviderFilterValueOperator.GreaterThanOrEqual:
                    valueMongoQuery = { $gte: value.value };
                    break;
                case DataProviderFilterValueOperator.In:
                    valueMongoQuery = { $in: value.value };
                    break;
                case DataProviderFilterValueOperator.LessThan:
                    valueMongoQuery = { $lt: value.value };
                    break;
                case DataProviderFilterValueOperator.LessThanOrEqual:
                    valueMongoQuery = { $lte: value.value };
                    break;
                case DataProviderFilterValueOperator.NotEqual:
                    valueMongoQuery = { $ne: value.value };
                    break;
                case DataProviderFilterValueOperator.NotIn:
                    valueMongoQuery = { $nin: value.value };
                    break;
                case DataProviderFilterValueOperator.Regex:
                    valueMongoQuery = { $regex: value.value, $options: "i" };
                    break;
                case DataProviderFilterValueOperator.Object:
                    valueMongoQuery = { $elemMatch: value.value };
                    break;
                case DataProviderFilterValueOperator.Equal:
                    valueMongoQuery = { $eq: value.value };
                    break;
                case DataProviderFilterValueOperator.None:
                default:
                    valueMongoQuery = value.value;
            }

            if (
                value.logicalOp &&
                value.logicalOp === DataProviderFilterValueLogicalOperator.Not
            ) {
                valueMongoQuery = { $not: valueMongoQuery };
            }

            itemMongoQuery[key] = valueMongoQuery;
        });

        return itemMongoQuery;
    });

    let query: FilterQuery<any> = {};

    if (queries.length === 1) {
        query = queries[0];
    } else {
        switch (filter.combineOp) {
            case DataProviderFilterCombineOperator.And:
                query.$and = queries;
                break;
            case DataProviderFilterCombineOperator.Nor:
                query.$nor = queries;
                break;
            case DataProviderFilterCombineOperator.Or:
            default:
                query.$or = queries;
                break;
        }
    }

    return query;
}
