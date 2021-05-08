import { IClient } from "../../mongo/client";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicClient } from "./types";

const publicClientFields = getFields<IPublicClient>({
    createdAt: getDateString,
    customId: true,
    hasUserSeenNotificationsPermissionDialog: true,
    isSubcribedToPushNotifications: true,
    userId: true,
    muteNotifications: true,
    clientType: true,
    clientId: true,
    tokenId: true,
});

export function getPublicClientData(client: IClient): IPublicClient {
    return extractFields(client, publicClientFields);
}

export function getPublicClientArray(clients: IClient[]): IPublicClient[] {
    return clients.map((client) => extractFields(client, publicClientFields));
}
