import { IClient } from "../../mongo/client";
import { extractFields, getFields } from "../utils";
import { IPublicClient } from "./types";

const publicClientFields = getFields<IPublicClient>({
    hasUserSeenNotificationsPermissionDialog: true,
    isSubcribedToPushNotifications: true,
    muteChatNotifications: true,
    clientId: true,
});

export function getPublicClientData(client: IClient): IPublicClient {
    return extractFields(client, publicClientFields);
}

export function getPublicClientArray(clients: IClient[]): IPublicClient[] {
    return clients.map((client) => extractFields(client, publicClientFields));
}
