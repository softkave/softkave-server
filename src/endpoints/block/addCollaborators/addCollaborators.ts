import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaborationRequest";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import { getPublicCollaborationRequestArray } from "../../notifications/utils";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import { broadcastToOrgsAndExistingUsers } from "./broadcastToOrgAndExistingUsers";
import filterNewCollaborators from "./filterNewCollaborators";
import sendEmails from "./sendEmails";
import { AddCollaboratorEndpoint } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

const addCollaborators: AddCollaboratorEndpoint = async (context, instData) => {
    const result = validate(instData.data, addCollaboratorsJoiSchema);
    const collaborators = result.collaborators;
    const user = await context.session.getUser(context, instData);
    const org = await context.block.getBlockById(context, result.blockId);

    assertBlock(org);

    if (org.type !== BlockType.Org) {
        throw new InvalidRequestError();
    }

    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(org),
            resourceType: SystemResourceType.CollaborationRequest,
            action: SystemActionType.Create,
            permissionResourceId: org.permissionResourceId,
        },
        user
    );

    const { indexedExistingUsers } = await filterNewCollaborators(context, {
        block: org,
        collaborators,
    });

    const now = getDate();
    const collaborationRequests = collaborators.map((request) => {
        const notificationBody =
            request.body ||
            `You have been invited by ${user.name} to collaborate in ${org.name}.`;

        const newRequest: ICollaborationRequest = {
            customId: request.customId,
            from: {
                userId: user.customId,
                name: user.name,
                blockId: org.customId,
                blockName: org.name,
                blockType: org.type,
            },
            createdAt: now,
            title: `Collaboration request from ${org.name}`,
            body: notificationBody,
            to: {
                email: request.email,
            },
            expiresAt: request.expiresAt as any,
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
        block: org,
        collaborationRequests,
        indexedExistingUsers,
    });

    // TODO: maybe deffer sending email till end of day
    fireAndForgetPromise(
        sendEmails(context, instData, {
            user,
            block: org,
            indexedExistingUsers,
            requests: collaborationRequests,
        })
    );

    return {
        requests: getPublicCollaborationRequestArray(collaborationRequests),
    };
};

export default addCollaborators;
