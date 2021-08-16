import { IClient, IClientUserEntry } from "../../mongo/client";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { ClientDoesNotExistError } from "../client/errors";
import { findUserEntryInClient } from "../client/utils";
import { IBaseContext } from "../contexts/BaseContext";
import { IClientContext } from "../contexts/ClientContext";
import RequestData from "../RequestData";

const clients: IClient[] = [];

class TestClientContext implements IClientContext {
    public getClientByPushSubscription = async (
        ctx: IBaseContext,
        endpoint: string,
        keys: IClient["keys"]
    ) => {
        return clients.find((client) => {
            return (
                client.endpoint === endpoint &&
                client.keys?.auth === keys.auth &&
                client.keys?.p256dh === keys.p256dh
            );
        });
    };

    public saveClient = async (ctx: IBaseContext, data: IClient) => {
        clients.push(data);
        return clients[clients.length - 1];
    };

    public getClientById = async (ctx: IBaseContext, clientId: string) => {
        return clients.find((client) => client.clientId === clientId);
    };

    public getPushSubscribedClients = async (
        ctx: IBaseContext,
        userId: string
    ) => {
        return clients.filter((client) => {
            return (
                client.endpoint &&
                client.keys &&
                client.users.find(
                    (user) =>
                        user.userId === userId && !user.muteChatNotifications
                )
            );
        });
    };

    public assertGetClientById = async (
        ctx: IBaseContext,
        clientId: string
    ) => {
        const client = await ctx.client.getClientById(ctx, clientId);

        if (!client) {
            throw new ClientDoesNotExistError();
        }

        return client;
    };

    public updateUserEntry = async (
        ctx: IBaseContext,
        reqData: RequestData,
        clientId: string,
        userId: string,
        data: Partial<IClientUserEntry>
    ) => {
        const client = await ctx.client.assertGetClientById(ctx, clientId);
        const tokenData = await ctx.session.getTokenData(ctx, reqData);
        let { index, entry } = findUserEntryInClient(client, userId) || {
            index: client.users.length,
            entry: {
                userId,
                tokenId: tokenData.customId,
            },
        };

        entry = { ...entry, ...data };
        client.users[index] = entry;
        return client;
    };

    public updateClientById = async (
        ctx: IBaseContext,
        clientId: string,
        data: Partial<IClient>
    ) => {
        const index = clients.findIndex(
            (client) => client.clientId === clientId
        );

        if (index !== -1) {
            clients[index] = { ...clients[index], ...data };
            return clients[index];
        }
    };
}

export const getTestClientContext = getSingletonFunc(
    () => new TestClientContext()
);
