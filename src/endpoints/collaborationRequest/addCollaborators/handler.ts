import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaboration-request";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { getPublicCollaborationRequestArray } from "../../notifications/utils";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import { fireAndForgetPromise } from "../../utils";
import { broadcastToOrganizationsAndExistingUsers } from "./broadcastToOrganizationAndExistingUsers";
import filterNewCollaborators from "./filterNewCollaborators";
import sendEmails from "./sendEmails";
import { AddCollaboratorEndpoint } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

const addCollaborators: AddCollaboratorEndpoint = async (context, instData) => {
    const result = validate(instData.data, addCollaboratorsJoiSchema);
    const collaborators = result.collaborators;
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.assertGetBlockById<IOrganization>(
        context,
        result.organizationId,
        throwOrganizationNotFoundError
    );

    canReadOrganization(organization.customId, user);

    const { indexedExistingUsers } = await filterNewCollaborators(context, {
        organization,
        collaborators,
    });

    const now = getDate();
    const collaborationRequests = collaborators.map((request) => {
        const newRequest: ICollaborationRequest = {
            customId: getNewId(),
            from: {
                userId: user.customId,
                name: user.name,
                blockId: organization.customId,
                blockName: organization.name,
                blockType: organization.type,
            },
            createdAt: now,
            title: `Collaboration request from ${organization.name}`,
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

    broadcastToOrganizationsAndExistingUsers(context, instData, {
        organization: organization,
        collaborationRequests,
        indexedExistingUsers,
    });

    // TODO: maybe deffer sending email till end of day
    fireAndForgetPromise(
        sendEmails(context, instData, {
            user,
            organization: organization,
            indexedExistingUsers,
            requests: collaborationRequests,
        })
    );

    return {
        requests: getPublicCollaborationRequestArray(collaborationRequests),
    };
};

export default addCollaborators;
