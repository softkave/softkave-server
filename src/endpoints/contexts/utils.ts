import { Document } from "mongoose";
import MongoModel from "../../mongo/MongoModel";
import cast from "../../utilities/fns";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface ICoreContextFunctionsWithId<T extends { customId: string }> {
    getItemById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<T | undefined>;
    assertGetItemById: (
        ctx: IBaseContext,
        customId: string,
        throwError: () => void
    ) => Promise<T>;
    assertItemById: (
        ctx: IBaseContext,
        customId: string,
        throwError: () => void
    ) => Promise<boolean>;
    bulkGetItemsByIds: (ctx: IBaseContext, customIds: string[]) => Promise<T[]>;
    bulkGetItemsByField: <Field extends keyof T>(
        ctx: IBaseContext,
        field: Field | string,
        value: T[Field] | any
    ) => Promise<T[]>;
    updateItemById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<T>
    ) => Promise<T | undefined>;
    saveItem: (ctx: IBaseContext, item: T) => Promise<T>;
    deleteItemById: (ctx: IBaseContext, customId: string) => Promise<void>;
    bulkDeleteItemsById: (
        ctx: IBaseContext,
        customIds: string[]
    ) => Promise<void>;
    bulkDeleteItemsByField: <Field extends keyof T>(
        ctx: IBaseContext,
        field: Field | string,
        value: T[Field] | any
    ) => Promise<void>;
    checkItemExistsByName: (
        ctx: IBaseContext,
        nameField: keyof T,
        name: string
    ) => Promise<boolean>;
}

export function makeCoreContextFunctionsWithId<
    T extends { customId: string },
    Context extends ICoreContextFunctionsWithId<T>,
    Model extends MongoModel<Document<T>>
>(contextName: keyof IBaseContext, modelName: keyof IBaseContext["models"]) {
    return class implements ICoreContextFunctionsWithId<T> {
        getItemById = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, customId: string) => {
                const model = cast<Model>(ctx.models[modelName]);
                const item = await model.model
                    .findOne({
                        customId: customId,
                    })
                    .lean()
                    .exec();

                return cast<T | undefined>(item);
            }
        );

        assertGetItemById = wrapFireAndThrowErrorAsync(
            async (
                ctx: IBaseContext,
                customId: string,
                throwError: () => void
            ) => {
                const context = cast<Context>(ctx[contextName]);
                const item = await context.getItemById(ctx, customId);

                if (!item) {
                    throwError();
                }

                return cast<T>(item);
            }
        );

        assertItemById = wrapFireAndThrowErrorAsync(
            async (
                ctx: IBaseContext,
                customId: string,
                throwError: () => void
            ) => {
                const model = cast<Model>(ctx.models[modelName]);
                const exists = await model.model.exists({
                    customId,
                });

                if (!exists) {
                    throwError();
                }

                return exists;
            }
        );

        bulkGetItemsByIds = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, customIds: string[]) => {
                const model = cast<Model>(ctx.models[modelName]);
                const items = await model.model
                    .find({
                        customId: { $in: customIds },
                    })
                    .lean()
                    .exec();

                return cast<T[]>(items);
            }
        );

        bulkGetItemsByField = wrapFireAndThrowErrorAsync(
            async <Field extends keyof T>(
                ctx: IBaseContext,
                field: Field | string,
                value: T[Field] | any
            ) => {
                const model = cast<Model>(ctx.models[modelName]);
                const items = await model.model
                    .find({
                        [field]: value,
                    })
                    .lean()
                    .exec();

                return cast<T[]>(items);
            }
        );

        updateItemById = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, customId: string, data: Partial<T>) => {
                const model = cast<Model>(ctx.models[modelName]);
                const block = model.model
                    .findOneAndUpdate({ customId }, data, {
                        new: true,
                    })
                    .lean()
                    .exec();

                return cast<T | undefined>(block);
            }
        );

        saveItem = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, item: T) => {
                const model = cast<Model>(ctx.models[modelName]);
                const newItem = new model.model(item);
                const savedItem = await newItem.save();
                return cast<T>(savedItem);
            }
        );

        deleteItemById = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, customId: string) => {
                const model = cast<Model>(ctx.models[modelName]);
                await model.model.deleteOne({ customId }).exec();
            }
        );

        bulkDeleteItemsById = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, customIds: string[]) => {
                const model = cast<Model>(ctx.models[modelName]);
                await model.model
                    .deleteMany({ customId: { $in: customIds } })
                    .exec();
            }
        );

        bulkDeleteItemsByField = wrapFireAndThrowErrorAsync(
            async <Field extends keyof T>(
                ctx: IBaseContext,
                field: Field | string,
                value: T[Field] | any
            ) => {
                const model = cast<Model>(ctx.models[modelName]);
                await model.model.deleteMany({ [field]: value }).exec();
            }
        );

        checkItemExistsByName = wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, nameField: keyof T, name: string) => {
                const model = cast<Model>(ctx.models[modelName]);
                return await model.model.exists({
                    [nameField]: { $regex: name, $options: "i" },
                });
            }
        );
    };
}
