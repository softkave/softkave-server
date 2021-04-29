import { IClient } from "../../mongo/client";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicClient } from "./types";

const publicClientFields = getFields<IPublicClient>({
    createdAt: getDateString,
    customId: true,
    grantedNotificationsPermission: true,
    hasNotificationsAPI: true,
    userId: true,
});

export function getPublicClientData(client: IClient): IPublicClient {
    return extractFields(client, publicClientFields);
}

export function getPublicClientArray(clients: IClient[]): IPublicClient[] {
    return clients.map((client) => extractFields(client, publicClientFields));
}
