import { validate } from "../../../utilities/joiUtils";
import { ClientDoesNotExistError } from "../../client/errors";
import { getPublicClientData } from "../../client/utils";
import { UpdateClientEndpoint } from "./types";
import { updateClientJoiSchema } from "./validation";

const updateClient: UpdateClientEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateClientJoiSchema);
    const user = await context.session.getUser(context, instData);
    const client = await context.client.updateUserEntry(
        context,
        instData,
        instData.clientId,
        user.customId,
        data.data
    );

    if (!client) {
        throw new ClientDoesNotExistError();
    }

    return { client: getPublicClientData(client, user.customId) };
};

export default updateClient;
