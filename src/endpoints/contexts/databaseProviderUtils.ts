import { isArray, isObjectLike, isString } from "lodash";
import { Document, FilterQuery } from "mongoose";
import MongoModel from "../../mongo/MongoModel";
import cast from "../../utilities/fns";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

// type ScalarFieldValue = string | number | boolean | null;
// type FieldValue =
//     | ScalarFieldValue
//     | Record<string, ScalarFieldValue>
//     | Array<ScalarFieldValue>;

// interface IFilterField<T, Field extends keyof T> {
//     field: Field;
//     value: Partial<T[Field]>;
// }

interface IFilterObjectValue<Value> {
    value: Value extends any[]
        ? Value[0] | null
        : Partial<Value> | Array<Partial<Value>> | null;
    useRegexOperator?: boolean;
}

type IFilterObject<T extends object> = {
    [K in keyof T]?: IFilterObjectValue<T[K]>;
};

export interface ICoreContextFunctionsWithId<T extends object> {
    // getItemById: (
    //     ctx: IBaseContext,
    //     customId: string
    // ) => Promise<T | undefined>;
    // assertGetItemById: (
    //     ctx: IBaseContext,
    //     customId: string,
    //     throwError: () => void
    // ) => Promise<T>;
    // assertItemById: (
    //     ctx: IBaseContext,
    //     customId: string,
    //     throwError: () => void
    // ) => Promise<boolean>;
    // bulkGetItemsByIds: (ctx: IBaseContext, customIds: string[]) => Promise<T[]>;
    // bulkGetItemsByField: <Field extends keyof T>(
    //     ctx: IBaseContext,
    //     field: Field | string,
    //     value: T[Field] | any
    // ) => Promise<T[]>;
    // updateItemById: (
    //     ctx: IBaseContext,
    //     customId: string,
    //     data: Partial<T>
    // ) => Promise<T | undefined>;
    // // saveItem: (ctx: IBaseContext, item: T) => Promise<T>;
    // deleteItemById: (ctx: IBaseContext, customId: string) => Promise<void>;
    // bulkDeleteItemsById: (
    //     ctx: IBaseContext,
    //     customIds: string[]
    // ) => Promise<void>;
    // bulkDeleteItemsByField: <Field extends keyof T>(
    //     ctx: IBaseContext,
    //     field: Field | string,
    //     value: T[Field] | any
    // ) => Promise<void>;
    // checkItemExistsByName: (
    //     ctx: IBaseContext,
    //     nameField: keyof T,
    //     name: string
    // ) => Promise<boolean>;

    // saveItem: (ctx: IBaseContext, item: T) => Promise<T>;
    // checkItemExistsByField: <Field extends keyof T>(
    //     ctx: IBaseContext,
    //     data: IFilterField<T, Field>
    // ) => Promise<boolean>;
    // getItemByField: <Field extends keyof T>(
    //     ctx: IBaseContext,
    //     data: IFilterField<T, Field>
    // ) => Promise<T | null>;
    // getManyItemsByField: <Field extends keyof T>(
    //     ctx: IBaseContext,
    //     data: IFilterField<T, Field>
    // ) => Promise<Array<T>>;

    checkItemExistsByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>
    ) => Promise<boolean>;
    getItemByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>
    ) => Promise<T | null>;
    getManyItemsByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>
    ) => Promise<Array<T>>;
    deleteItemByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>
    ) => Promise<void>;
    deleteManyItemsByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>
    ) => Promise<void>;
    assertItemExistsByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>,
        throwError: () => void
    ) => Promise<boolean>;
    assertGetItemByFilterObject: (
        ctx: IBaseContext,
        data: IFilterObject<T>,
        throwError: () => void
    ) => Promise<T>;
}

export function makeCoreContextFunctionsWithId<
    T extends { customId: string },
    Context extends ICoreContextFunctionsWithId<T>,
    Model extends MongoModel<Document<T>>
>(contextName: keyof IBaseContext, modelName: keyof IBaseContext["models"]) {
    return class implements ICoreContextFunctionsWithId<T> {
        // getItemById = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, customId: string) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         const item = await model.model
        //             .findOne({
        //                 customId: customId,
        //             })
        //             .lean()
        //             .exec();
        //         return cast<T | undefined>(item);
        //     }
        // );
        // assertGetItemById = wrapFireAndThrowErrorAsync(
        //     async (
        //         ctx: IBaseContext,
        //         customId: string,
        //         throwError: () => void
        //     ) => {
        //         const context = cast<Context>(ctx[contextName]);
        //         const item = await context.getItemById(ctx, customId);
        //         if (!item) {
        //             throwError();
        //         }
        //         return cast<T>(item);
        //     }
        // );
        // assertItemById = wrapFireAndThrowErrorAsync(
        //     async (
        //         ctx: IBaseContext,
        //         customId: string,
        //         throwError: () => void
        //     ) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         const exists = await model.model.exists({
        //             customId,
        //         });
        //         if (!exists) {
        //             throwError();
        //         }
        //         return exists;
        //     }
        // );
        // bulkGetItemsByIds = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, customIds: string[]) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         const items = await model.model
        //             .find({
        //                 customId: { $in: customIds },
        //             })
        //             .lean()
        //             .exec();
        //         return cast<T[]>(items);
        //     }
        // );
        // bulkGetItemsByField = wrapFireAndThrowErrorAsync(
        //     async <Field extends keyof T>(
        //         ctx: IBaseContext,
        //         field: Field | string,
        //         value: T[Field] | any
        //     ) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         const items = await model.model
        //             .find({
        //                 [field]: value,
        //             })
        //             .lean()
        //             .exec();
        //         return cast<T[]>(items);
        //     }
        // );
        // updateItemById = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, customId: string, data: Partial<T>) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         const block = model.model
        //             .findOneAndUpdate({ customId }, data, {
        //                 new: true,
        //             })
        //             .lean()
        //             .exec();
        //         return cast<T | undefined>(block);
        //     }
        // );
        // saveItem = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, item: T) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         const newItem = new model.model(item);
        //         const savedItem = await newItem.save();
        //         return cast<T>(savedItem);
        //     }
        // );
        // deleteItemById = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, customId: string) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         await model.model.deleteOne({ customId }).exec();
        //     }
        // );
        // bulkDeleteItemsById = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, customIds: string[]) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         await model.model
        //             .deleteMany({ customId: { $in: customIds } })
        //             .exec();
        //     }
        // );
        // bulkDeleteItemsByField = wrapFireAndThrowErrorAsync(
        //     async <Field extends keyof T>(
        //         ctx: IBaseContext,
        //         field: Field | string,
        //         value: T[Field] | any
        //     ) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         await model.model.deleteMany({ [field]: value }).exec();
        //     }
        // );
        // checkItemExistsByName = wrapFireAndThrowErrorAsync(
        //     async (ctx: IBaseContext, nameField: keyof T, name: string) => {
        //         const model = cast<Model>(ctx.models[modelName]);
        //         return await model.model.exists({
        //             [nameField]: { $regex: name, $options: "i" },
        //         });
        //     }
        // );

        checkItemExistsByFilterObject = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, data: IFilterObject<T>) => {
                const model = cast<Model>(ctx.models[modelName]);
                const mongoQuery = getQueryFromFilterObject(data);
                return await model.model.exists(mongoQuery);
            }
        );

        getItemByFilterObject = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, data: IFilterObject<T>) => {
                const model = cast<Model>(ctx.models[modelName]);
                const mongoQuery = getQueryFromFilterObject(data);
                const item = await model.model
                    .findOne(mongoQuery)
                    .lean()
                    .exec();
                return cast<T>(item);
            }
        );

        getManyItemsByFilterObject = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, data: IFilterObject<T>) => {
                const model = cast<Model>(ctx.models[modelName]);
                const mongoQuery = getQueryFromFilterObject(data);
                const items = await model.model.find(mongoQuery).lean().exec();
                return cast<T[]>(items);
            }
        );

        deleteItemByFilterObject = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, data: IFilterObject<T>) => {
                const model = cast<Model>(ctx.models[modelName]);
                const mongoQuery = getQueryFromFilterObject(data);
                await model.model.deleteOne(mongoQuery).exec();
            }
        );

        deleteManyItemsByFilterObject = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, data: IFilterObject<T>) => {
                const model = cast<Model>(ctx.models[modelName]);
                const mongoQuery = getQueryFromFilterObject(data);
                await model.model.deleteMany(mongoQuery).exec();
            }
        );

        assertItemExistsByFilterObject = wrapFireAndThrowErrorAsync(
            async (
                ctx: IBaseContext,
                data: IFilterObject<T>,
                throwError: () => void
            ) => {
                const context = cast<Context>(ctx[contextName]);
                const item = await context.getItemByFilterObject(ctx, data);
                if (!item) {
                    throwError();
                }
                return true;
            }
        );

        assertGetItemByFilterObject = wrapFireAndThrowErrorAsync(
            async (
                ctx: IBaseContext,
                data: IFilterObject<T>,
                throwError: () => void
            ) => {
                const context = cast<Context>(ctx[contextName]);
                const item = await context.getItemByFilterObject(ctx, data);
                if (!item) {
                    throwError();
                }
                return cast<T>(item);
            }
        );
    };
}

function getQueryFromFilterObject<T extends object>(data: IFilterObject<T>) {
    const query: FilterQuery<T> = {};

    Object.keys(data).forEach((key) => {
        const value: IFilterObjectValue<any> = data[key];

        if (isArray(value.value)) {
            // @ts-ignore
            query[key] = { $in: value.value };
        } else if (isObjectLike(value.value)) {
            // @ts-ignore
            query[key] = { $elemMatch: value.value };
        } else if (isString(value.value) && value.useRegexOperator) {
            // @ts-ignore
            query[key] = { $regex: value.value, $options: "i" };
        } else {
            // @ts-ignore
            query[key] = value.value;
        }
    });

    return query;
}
