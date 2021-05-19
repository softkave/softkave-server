import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../client/utils";
import { fireAndForgetPromise } from "../../utils";
import { UpdateClientEndpoint } from "./types";
import { updateClientJoiSchema } from "./validation";

const updateClient: UpdateClientEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateClientJoiSchema);
    const user = await context.session.getUser(context, instData);
    let client = await context.session.getClient(context, instData);

    client = clientToClientUserView(
        await context.client.updateUserEntry(
            context,
            instData,
            client.clientId,
            user.customId,
            data.data
        ),
        user.customId
    );

    if (data.data.isLoggedIn) {
        fireAndForgetPromise(
            context.unseenChats.removeEntry(context, user.customId)
        );
    }

    return { client };
};

export default updateClient;
