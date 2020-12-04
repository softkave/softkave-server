import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getPublicNotificationsArray } from "../utils";
import { GetBlockNotificationsEndpoint } from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

const getOrgNotifications: GetBlockNotificationsEndpoint = async (
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

    const requests = await context.notification.getCollaborationRequestsByBlockId(
        context,
        block.customId
    );

    return {
        notifications: getPublicNotificationsArray(requests),
    };
};

export default getOrgNotifications;
