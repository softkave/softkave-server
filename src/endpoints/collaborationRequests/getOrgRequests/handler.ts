import { validate } from "../../../utilities/joiUtils";
import { getPublicCollaborationRequestArray } from "../../notifications/utils";
import canReadOrg from "../../org/canReadBlock";
import { IOrganization } from "../../org/types";
import { throwOrgNotFoundError } from "../../org/utils";
import { GetBlockNotificationsEndpoint } from "./types";
import { getOrgCollaborationRequestsJoiSchema } from "./validation";

const getOrgRequests: GetBlockNotificationsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getOrgCollaborationRequestsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.orgId,
        throwOrgNotFoundError
    );

    await canReadOrg(org.customId, user);

    const requests =
        await context.collaborationRequest.getCollaborationRequestsByBlockId(
            context,
            org.customId
        );

    return {
        requests: getPublicCollaborationRequestArray(requests),
    };
};

export default getOrgRequests;
