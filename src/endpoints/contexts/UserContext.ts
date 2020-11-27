import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { ICollaborator } from "../user/types";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IUserContext {
    getUserByEmail: (
        ctx: IBaseContext,
        email: string
    ) => Promise<IUser | undefined>;
    bulkGetUsersByEmail: (
        ctx: IBaseContext,
        email: string[]
    ) => Promise<IUser[]>;
    getUserById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IUser | undefined>;
    updateUserById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IUser>
    ) => Promise<IUser | undefined>;
    bulkGetUsersById: (ctx: IBaseContext, ids: string[]) => Promise<IUser[]>;
    saveUser: (
        ctx: IBaseContext,
        user: Omit<IUser, "customId">
    ) => Promise<IUser>;
    userExists: (ctx: IBaseContext, email: string) => Promise<boolean>;
    getBlockCollaborators: (
        ctx: IBaseContext,
        blockId: string
    ) => Promise<ICollaborator[]>;
    getOrgUsers: (ctx: IBaseContext, blockId: string) => Promise<IUser[]>;
    bulkUpdateUsersById: (
        ctx: IBaseContext,
        blocks: Array<IUpdateItemById<IUser>>
    ) => Promise<void>;
}

export default class UserContext implements IUserContext {
    public getUserByEmail = wrapFireAndThrowError(
        (ctx: IBaseContext, email: string) => {
            return ctx.models.userModel.model
                .findOne({
                    email,
                })
                .lean()
                .exec();
        }
    );

    public getUserById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.userModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public updateUserById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string, data: Partial<IUser>) => {
            return ctx.models.userModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public bulkGetUsersById = wrapFireAndThrowError(
        (ctx: IBaseContext, ids: string[]) => {
            return ctx.models.userModel.model
                .find({ customId: { $in: ids } })
                .exec();
        }
    );

    public userExists = wrapFireAndThrowError(
        (ctx: IBaseContext, email: string) => {
            return ctx.models.userModel.model.exists({ email });
        }
    );

    public bulkGetUsersByEmail = wrapFireAndThrowError(
        (ctx: IBaseContext, emails: string[]) => {
            return ctx.models.userModel.model
                .find({ email: { $in: emails } }, "email orgs")
                .lean()
                .exec();
        }
    );

    public getBlockCollaborators = wrapFireAndThrowError(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.userModel.model
                .find(
                    {
                        orgs: { $elemMatch: { customId: blockId } },
                    },
                    "name email createdAt customId color"
                )
                .lean()
                .exec();
        }
    );

    public getOrgUsers = wrapFireAndThrowError(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.userModel.model
                .find({
                    orgs: { $elemMatch: { customId: blockId } },
                })
                .lean()
                .exec();
        }
    );

    public bulkUpdateUsersById = wrapFireAndThrowError(
        async (ctx: IBaseContext, blocks: Array<IUpdateItemById<IUser>>) => {
            const opts = blocks.map((item) => ({
                updateOne: { filter: { customId: item.id }, update: item.data },
            }));

            await ctx.models.userModel.model.bulkWrite(opts);
        }
    );

    public async saveUser(ctx: IBaseContext, user: IUser) {
        const userDoc = new ctx.models.userModel.model(user);
        return saveNewItemToDb(async () => {
            userDoc.customId = getNewId();
            await userDoc.save();
            return userDoc;
        });
    }
}

export const getUserContext = makeSingletonFunc(() => new UserContext());
