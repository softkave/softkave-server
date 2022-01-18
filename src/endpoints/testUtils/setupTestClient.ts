import { ClientType } from "../../models/system";
import { IClient } from "../../mongo/client";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/IBaseContext";

export interface ISetupTestClientResult {
    client: IClient;
    context: IBaseContext;
}

export async function setupTestClient(
    context: IBaseContext
): Promise<ISetupTestClientResult> {
    let client: IClient = {
        clientId: getNewId(),
        createdAt: getDateString(),
        clientType: ClientType.Browser,
        users: [],
        endpoint: "",
        keys: {
            p256dh: "",
            auth: "",
        },
        pushSubscribedAt: "",
    };

    client = await context.client.saveClient(context, client);

    const result: ISetupTestClientResult = {
        context,
        client,
    };

    return result;
}
