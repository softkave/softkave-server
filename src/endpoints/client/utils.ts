import { IClient, IClientUserView } from "../../mongo/client";
import { extractFields, getFields } from "../utils";
import { IPublicClient } from "./types";

export function clientToClientUserView(client: IClient, userId: string) {
    const findResult = findUserEntryInClient(client, userId);

    if (!findResult) {
        throw new Error("Client is not attached to user");
    }

    const view: IClientUserView = {
        customId: client.customId,
        clientId: client.clientId,
        createdAt: client.createdAt,
        clientType: client.clientType,
        isSubcribedToPushNotifications: client.isSubcribedToPushNotifications,
        ...findResult.entry,
    };

    return view;
}

export function getPublicClientData(
    client: IClient,
    userId: string
): IPublicClient {
    return clientToClientUserView(client, userId);
}

export function getPublicClientArray(
    clients: IClient[],
    userId: string
): IPublicClient[] {
    return clients.map((client) => clientToClientUserView(client, userId));
}

export function findUserEntryInClient(client: IClient, userId: string) {
    const index = client.users.findIndex((data) => data.userId === userId);

    if (index === -1) {
        return null;
    } else {
        return { index, entry: client.users[index] };
    }
}
