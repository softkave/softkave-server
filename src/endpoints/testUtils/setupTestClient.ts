import { ClientType } from "../../models/system";
import { IClient } from "../../mongo/client";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";

export interface ISetupTestClientResult {
    client: IClient;
    context: IBaseContext;
}

let prevResult: ISetupTestClientResult | null = null;

export async function setupTestClient(
    context: IBaseContext
): Promise<ISetupTestClientResult> {
    if (prevResult) {
        console.log("using prev setupClient result");
        return prevResult;
    }

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

    prevResult = result;
    return result;
}
