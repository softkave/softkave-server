import { validate } from "../../../utilities/joiUtils";
import { UpdateClientEndpoint } from "./types";
import { updateClientJoiSchema } from "./validation";

const updateClient: UpdateClientEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateClientJoiSchema);
    const user = await context.session.getUser(context, instData);
    await context.client.updateClientById(
        context,
        data.customId,
        user.customId,
        data.data
    );
};

export default updateClient;
