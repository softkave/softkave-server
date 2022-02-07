import { forEach } from "lodash";
import { Document, FilterQuery, Model } from "mongoose";
import { cast } from "../../../utilities/fns";
import { wrapFireAndThrowErrorAsync } from "../../utils";
import {
    IDataProvider,
    DataProviderFilterValueOperator,
    DataProviderFilterValueLogicalOperator,
    IDataProviderFilter,
} from "./DataProvider";

export default class MongoDataProvider<T extends { [key: string]: any }>
    implements IDataProvider<T>
{
    constructor(
        private model: Model<Document<T>>,
        private throwNotFound?: () => void
    ) {}

    checkItemExists = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            return await this.model.exists(mongoQuery);
        }
    );

    getItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            const item = await this.model.findOne(mongoQuery).lean().exec();
            return cast<T | null>(item);
        }
    );

    getManyItems = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            const items = await this.model.find(mongoQuery).lean().exec();
            return cast<T[]>(items);
        }
    );

    deleteItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            await this.model.deleteOne(mongoQuery).exec();
        }
    );

    deleteManyItems = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            await this.model.deleteMany(mongoQuery).exec();
        }
    );

    updateItem = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>, data: Partial<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            const item = await this.model
                .findOneAndUpdate(mongoQuery, data, { new: true })
                .lean()
                .exec();
            return cast<T | null>(item);
        }
    );

    updateManyItems = wrapFireAndThrowErrorAsync(
        async (filter: IDataProviderFilter<T>, data: Partial<T>) => {
            const mongoQuery = getMongoQueryFromFilter(filter);
            await this.model
                .updateMany(mongoQuery, data, { new: true })
                .lean()
                .exec();
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
        const item = new this.model(data);
        const savedItem = await item.save();
        return cast<T>(savedItem);
    });

    bulkSaveItems = wrapFireAndThrowErrorAsync(async (data: T[]) => {
        await this.model.insertMany(data);
    });

    bulkUpdateItems = wrapFireAndThrowErrorAsync(
        async (
            items: Array<{
                filter: IDataProviderFilter<T>;
                data: Partial<T>;
                updateFirstItemOnly?: boolean;
            }>
        ) => {
            await this.model.bulkWrite(
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
    const query: FilterQuery<Document<any, any, any>> = {};

    forEach(filter.items, (value, key) => {
        if (!value) {
            return;
        }

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
                if (value.value instanceof RegExp) {
                    valueMongoQuery = {
                        $regex: value.value.source,
                        $options: value.value.flags,
                    };
                } else {
                    valueMongoQuery = { $regex: value.value };
                }
                break;
            case DataProviderFilterValueOperator.Object:
                valueMongoQuery = { $elemMatch: value.value };
                break;
            case DataProviderFilterValueOperator.Equal:
                valueMongoQuery = { $eq: value.value };
                break;
            // case DataProviderFilterValueOperator.None:
            default:
                valueMongoQuery = value.value;
        }

        if (
            value.logicalOp &&
            value.logicalOp === DataProviderFilterValueLogicalOperator.Not
        ) {
            valueMongoQuery = { $not: valueMongoQuery };
        }

        query[key] = valueMongoQuery;
    });

    return query;
}
