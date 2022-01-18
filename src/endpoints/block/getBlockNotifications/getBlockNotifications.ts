import { validate } from "../../../utilities/joiUtils";
import { getPublicCollaborationRequestArray } from "../../collaborationRequest/utils";
import canReadBlock from "../canReadBlock";
import { GetBlockNotificationsEndpoint } from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

const getBlockNotifications: GetBlockNotificationsEndpoint = async (
    context,
    instData
) => {
    const data = validate(
        instData.data,
        getBlockCollaborationRequestsJoiSchema
    );
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    await canReadBlock({ user, block });

    const requests =
        await context.collaborationRequest.getCollaborationRequestsByBlockId(
            context,
            block.customId
        );

    return {
        requests: getPublicCollaborationRequestArray(requests),
    };
};

export default getBlockNotifications;
