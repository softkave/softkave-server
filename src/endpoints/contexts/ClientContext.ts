import { IClient, IClientUserEntry } from "../../mongo/client";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { ClientDoesNotExistError } from "../client/errors";
import { findUserEntryInClient } from "../client/utils";
import RequestData from "../RequestData";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IClientContext {
    saveClient: (ctx: IBaseContext, client: IClient) => Promise<IClient>;
    getClientById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IClient | null>;
    getPushSubscribedClients: (
        ctx: IBaseContext,
        userId: string
    ) => Promise<IClient[]>;
    assertGetClientById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IClient>;
    updateUserEntry: (
        ctx: IBaseContext,
        reqData: RequestData,
        customId: string,
        userId: string,
        data: Partial<IClientUserEntry>
    ) => Promise<IClient | null>;
    updateClientById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IClient>
    ) => Promise<IClient | null>;
}

export default class ClientContext implements IClientContext {
    public saveClient = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: IClient) => {
            const client = new ctx.models.clientModel.model(data);
            return client.save();
        }
    );

    public getClientById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.clientModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public getPushSubscribedClients = wrapFireAndThrowError(
        (ctx: IBaseContext, userId: string) => {
            return ctx.models.clientModel.model
                .find({
                    isSubcribedToPushNotifications: true,
                    users: {
                        $elemMatch: { userId, muteChatNotifications: false },
                    },
                })
                .lean()
                .exec();
        }
    );

    public assertGetClientById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            const client = await ctx.client.getClientById(ctx, customId);

            if (!client) {
                throw new ClientDoesNotExistError();
            }

            return client;
        }
    );

    public updateUserEntry = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            reqData: RequestData,
            customId: string,
            userId: string,
            data: Partial<IClientUserEntry>
        ) => {
            const client = await ctx.models.clientModel.model
                .findOne({
                    customId,
                })
                .exec();

            let { index, entry } = findUserEntryInClient(client, userId) || {
                index: client.users.length,
                entry: {
                    userId,
                    tokenId: reqData.tokenData?.customId,
                },
            };

            entry = { ...entry, ...data };
            client.users[index] = entry;
            client.markModified("users");
            await client.save();
            return client;
        }
    );

    public updateClientById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string, data: Partial<IClient>) => {
            return await ctx.models.clientModel.model
                .findOneAndUpdate(
                    {
                        customId,
                    },
                    data,
                    { new: true }
                )
                .lean()
                .exec();
        }
    );
}

export const getClientContext = makeSingletonFunc(() => new ClientContext());
