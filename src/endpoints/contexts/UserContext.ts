import { IUser } from "../../mongo/user";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { ICollaborator } from "../collaborator/types";
import { UserDoesNotExistError } from "../user/errors";
import { saveNewItemToDb, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IUserContext {
    getUserByEmail: (ctx: IBaseContext, email: string) => Promise<IUser | null>;
    bulkGetUsersByEmail: (
        ctx: IBaseContext,
        email: string[]
    ) => Promise<IUser[]>;
    getUserById: (ctx: IBaseContext, customId: string) => Promise<IUser | null>;
    assertGetUserById: (ctx: IBaseContext, customId: string) => Promise<IUser>;
    updateUserById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IUser>
    ) => Promise<IUser | null>;
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
    getOrganizationUsers: (
        ctx: IBaseContext,
        blockId: string
    ) => Promise<IUser[]>;
    bulkUpdateUsersById: (
        ctx: IBaseContext,
        users: Array<IUpdateItemById<IUser>>
    ) => Promise<void>;
}

export default class UserContext implements IUserContext {
    public getUserByEmail = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, email: string) => {
            return ctx.models.userModel.model
                .findOne({
                    email,
                })
                .lean()
                .exec();
        }
    );

    public getUserById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.userModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public assertGetUserById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, customId: string) => {
            const user = await ctx.user.getUserById(ctx, customId);

            if (!user) {
                throw new UserDoesNotExistError();
            }

            return user;
        }
    );

    public updateUserById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, customId: string, data: Partial<IUser>) => {
            return ctx.models.userModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public bulkGetUsersById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, ids: string[]) => {
            return ctx.models.userModel.model
                .find({ customId: { $in: ids } })
                .exec();
        }
    );

    public userExists = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, email: string) => {
            return ctx.models.userModel.model.exists({ email });
        }
    );

    public bulkGetUsersByEmail = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, emails: string[]) => {
            return ctx.models.userModel.model
                .find({ email: { $in: emails } }, "email organizations")
                .lean()
                .exec();
        }
    );

    public getBlockCollaborators = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.userModel.model
                .find(
                    {
                        organizations: { $elemMatch: { customId: blockId } },
                    },
                    {
                        organizations: { $elemMatch: { customId: blockId } },
                        name: 1,
                        email: 1,
                        createdAt: 1,
                        customId: 1,
                        color: 1,
                    }
                )
                .lean()
                .exec();
        }
    );

    public getOrganizationUsers = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.userModel.model
                .find({
                    organizations: { $elemMatch: { customId: blockId } },
                })
                .lean()
                .exec();
        }
    );

    public bulkUpdateUsersById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, users: Array<IUpdateItemById<IUser>>) => {
            const opts = users.map((item) => ({
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

export const getUserContext = makeSingletonFn(() => new UserContext());
