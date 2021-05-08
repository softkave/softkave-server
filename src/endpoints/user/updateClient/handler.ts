import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { ClientDoesNotExistError } from "../../client/errors";
import { getPublicClientData } from "../../client/utils";
import { UpdateClientEndpoint } from "./types";
import { updateClientJoiSchema } from "./validation";

const updateClient: UpdateClientEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateClientJoiSchema);
    const user = await context.session.getUser(context, instData);
    const client = await context.client.updateClientByClientAndUserId(
        context,
        data.customId,
        user.customId,
        { ...data.data, updatedAt: getDateString() }
    );

    if (!client) {
        throw new ClientDoesNotExistError();
    }

    return { client: getPublicClientData(client) };
};

export default updateClient;
