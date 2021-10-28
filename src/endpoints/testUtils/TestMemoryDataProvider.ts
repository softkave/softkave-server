import { cast } from "../../utilities/fns";
import { IDataProvider } from "../contexts/DataProvider";
import { wrapFireAndThrowErrorAsync } from "../utils";

export default class TestMemoryDataProvider<T extends object>
    implements IDataProvider<T>
{
    checkItemExists = async (filter: IDataProviderFilter<T>) => {
        const mongoQuery = getMongoQueryFromFilter(filter);
        return await this.model.model.exists(mongoQuery);
    };

    getItem = async (filter: IDataProviderFilter<T>) => {
        const mongoQuery = getMongoQueryFromFilter(filter);
        const item = await this.model.model.findOne(mongoQuery).lean().exec();
        return cast<T | null>(item);
    };

    getManyItems = async (
        filter: IDataProviderFilter<T>,
        options?: IGetManyItemsOptions
    ) => {
        const mongoQuery = getMongoQueryFromFilter(filter);
        const items = await this.model.model.find(mongoQuery).lean().exec();
        return cast<T[]>(items);
    };

    deleteItem = async (filter: IDataProviderFilter<T>) => {
        const mongoQuery = getMongoQueryFromFilter(filter);
        await this.model.model.deleteOne(mongoQuery).exec();
    };

    deleteManyItems = async (filter: IDataProviderFilter<T>) => {
        const mongoQuery = getMongoQueryFromFilter(filter);
        await this.model.model.deleteMany(mongoQuery).exec();
    };

    updateItem = async (filter: IDataProviderFilter<T>, data: Partial<T>) => {
        const mongoQuery = getMongoQueryFromFilter(filter);
        const item = await this.model.model
            .findOneAndUpdate(mongoQuery, data, { new: true })
            .lean()
            .exec();
        return cast<T | null>(item);
    };

    assertItemExists = async (
        filter: IDataProviderFilter<T>,
        throwError?: () => void
    ) => {
        const item = await this.getItem(filter);

        if (!item) {
            if (throwError) {
                throwError();
            } else if (this.throwNotFound) {
                this.throwNotFound();
            }
        }

        return true;
    };

    assertGetItem = async (
        filter: IDataProviderFilter<T>,
        throwError?: () => void
    ) => {
        const item = await this.getItem(filter);

        if (!item) {
            if (throwError) {
                throwError();
            } else if (this.throwNotFound) {
                this.throwNotFound();
            }
        }

        return cast<T>(item);
    };

    assertUpdateItem = async (
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
    };

    saveItem = async (data: T) => {
        const item = new this.model.model(data);
        const savedItem = await item.save();
        return cast<T>(savedItem);
    };

    bulkSaveItems = async (data: T[]) => {
        await this.model.model.insertMany(data);
    };

    bulkDeleteItems = async (
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
    };

    bulkUpdateItems = async (
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
    };
}
