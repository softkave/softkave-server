import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaboration-request";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { getPublicCollaborationRequestArray } from "../../notifications/utils";
import canReadOrg from "../../org/canReadBlock";
import { IOrganization } from "../../org/types";
import { throwOrgNotFoundError } from "../../org/utils";
import { fireAndForgetPromise } from "../../utils";
import { broadcastToOrgsAndExistingUsers } from "./broadcastToOrgAndExistingUsers";
import filterNewCollaborators from "./filterNewCollaborators";
import sendEmails from "./sendEmails";
import { AddCollaboratorEndpoint } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

const addCollaborators: AddCollaboratorEndpoint = async (context, instData) => {
    const result = validate(instData.data, addCollaboratorsJoiSchema);
    const collaborators = result.collaborators;
    const user = await context.session.getUser(context, instData);
    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        result.orgId,
        throwOrgNotFoundError
    );

    canReadOrg(org.customId, user);

    const { indexedExistingUsers } = await filterNewCollaborators(context, {
        org,
        collaborators,
    });

    const now = getDate();
    const collaborationRequests = collaborators.map((request) => {
        const newRequest: ICollaborationRequest = {
            customId: getNewId(),
            from: {
                userId: user.customId,
                name: user.name,
                blockId: org.customId,
                blockName: org.name,
                blockType: org.type,
            },
            createdAt: now,
            title: `Collaboration request from ${org.name}`,
            to: {
                email: request.email,
            },
            statusHistory: [
                {
                    status: CollaborationRequestStatusType.Pending,
                    date: now,
                },
            ],
            sentEmailHistory: [],
        };

        return newRequest;
    });

    await context.collaborationRequest.bulkSaveCollaborationRequests(
        context,
        collaborationRequests
    );

    broadcastToOrgsAndExistingUsers(context, instData, {
        org: org,
        collaborationRequests,
        indexedExistingUsers,
    });

    // TODO: maybe deffer sending email till end of day
    fireAndForgetPromise(
        sendEmails(context, instData, {
            user,
            org: org,
            indexedExistingUsers,
            requests: collaborationRequests,
        })
    );

    return {
        requests: getPublicCollaborationRequestArray(collaborationRequests),
    };
};

export default addCollaborators;
