import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaboration-request";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import { getPublicCollaborationRequestArray } from "../../notifications/utils";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { broadcastToOrganizationsAndExistingUsers } from "./broadcastToOrganizationAndExistingUsers";
import filterNewCollaborators from "./filterNewCollaborators";
import sendEmails from "./sendEmails";
import { AddCollaboratorEndpoint } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

const addCollaborators: AddCollaboratorEndpoint = async (context, instData) => {
    const result = validate(instData.data, addCollaboratorsJoiSchema);
    const collaborators = result.collaborators;
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.getBlockById(
        context,
        result.blockId
    );

    assertBlock(organization);

    if (organization.type !== BlockType.Organization) {
        throw new InvalidRequestError();
    }

    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(organization),
    //         resourceType: SystemResourceType.CollaborationRequest,
    //         action: SystemActionType.Create,
    //         permissionResourceId: organization.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: organization });

    const { indexedExistingUsers } = await filterNewCollaborators(context, {
        block: organization,
        collaborators,
    });

    const now = getDate();
    const collaborationRequests = collaborators.map((request) => {
        const newRequest: ICollaborationRequest = {
            customId: request.customId,
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
        block: organization,
        collaborationRequests,
        indexedExistingUsers,
    });

    // TODO: maybe deffer sending email till end of day
    fireAndForgetPromise(
        sendEmails(context, instData, {
            user,
            block: organization,
            indexedExistingUsers,
            requests: collaborationRequests,
        })
    );

    return {
        requests: getPublicCollaborationRequestArray(collaborationRequests),
    };
};

export default addCollaborators;
