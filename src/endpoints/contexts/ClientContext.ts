import { IClient, IClientUserEntry } from "../../mongo/client";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { ClientDoesNotExistError } from "../client/errors";
import { findUserEntryInClient } from "../client/utils";
import RequestData from "../RequestData";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IClientContext {
    saveClient: (ctx: IBaseContext, client: IClient) => Promise<IClient>;
    getClientById: (
        ctx: IBaseContext,
        clientId: string
    ) => Promise<IClient | null>;
    getPushSubscribedClients: (
        ctx: IBaseContext,
        userId: string
    ) => Promise<IClient[]>;
    assertGetClientById: (
        ctx: IBaseContext,
        clientId: string
    ) => Promise<IClient>;
    updateUserEntry: (
        ctx: IBaseContext,
        reqData: RequestData,
        clientId: string,
        userId: string,
        data: Partial<IClientUserEntry>
    ) => Promise<IClient | null>;
    updateClientById: (
        ctx: IBaseContext,
        clientId: string,
        data: Partial<IClient>
    ) => Promise<IClient | null>;
    getClientByPushSubscription: (
        ctx: IBaseContext,
        endpoint: string,
        keys: IClient["keys"]
    ) => Promise<IClient | null>;
}

export default class ClientContext implements IClientContext {
    public getClientByPushSubscription = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, endpoint: string, keys: IClient["keys"]) => {
            return ctx.models.clientModel.model
                .findOne({
                    endpoint,
                    "keys.p256dh": keys.p256dh,
                    "keys.auth": keys.auth,
                })
                .lean()
                .exec();
        }
    );

    public saveClient = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, data: IClient) => {
            const client = new ctx.models.clientModel.model(data);
            return client.save();
        }
    );

    public getClientById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, clientId: string) => {
            return ctx.models.clientModel.model
                .findOne({
                    clientId,
                })
                .lean()
                .exec();
        }
    );

    public getPushSubscribedClients = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, userId: string) => {
            return ctx.models.clientModel.model
                .find({
                    users: {
                        $elemMatch: {
                            userId,
                            muteChatNotifications: false,
                            isLoggedIn: true,
                        },
                    },
                    endpoint: { $ne: null },
                    keys: { $ne: null },
                })
                .lean()
                .exec();
        }
    );

    public assertGetClientById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, clientId: string) => {
            const client = await ctx.client.getClientById(ctx, clientId);

            if (!client) {
                throw new ClientDoesNotExistError();
            }

            return client;
        }
    );

    public updateUserEntry = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            reqData: RequestData,
            clientId: string,
            userId: string,
            data: Partial<IClientUserEntry>
        ) => {
            // TODO: possible performance improvement here
            // should we get the client from the reqData
            let client = await ctx.models.clientModel.model
                .findOne({
                    clientId,
                })
                .lean()
                .exec();

            if (!client) {
                throw new ClientDoesNotExistError();
            }

            const tokenData = await ctx.session.getTokenData(ctx, reqData);
            let { index, entry } = findUserEntryInClient(client, userId) || {
                index: client.users.length,
                entry: {
                    userId,
                    tokenId: tokenData.customId,
                },
            };

            entry = { ...entry, ...data };
            client = await ctx.models.clientModel.model
                .findOneAndUpdate(
                    {
                        clientId: client.clientId,
                    },
                    {
                        [`users.${index}`]: entry,
                    },
                    { new: true }
                )
                .lean()
                .exec();

            return client;
        }
    );

    public updateClientById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, clientId: string, data: Partial<IClient>) => {
            return await ctx.models.clientModel.model
                .findOneAndUpdate(
                    {
                        clientId,
                    },
                    data,
                    { new: true }
                )
                .lean()
                .exec();
        }
    );
}

export const getClientContext = makeSingletonFn(() => new ClientContext());
