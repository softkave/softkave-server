import { BlockType } from "../../../mongo/block";
import {
    CollaborationRequestStatusType,
    INotification,
    NotificationType,
} from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { broadcastToOrgsAndExistingUsers } from "./broadcastToOrgAndExistingUsers";
import filterNewCollaborators from "./filterNewCollaborators";
import sendEmails from "./sendEmails";
import { AddCollaboratorEndpoint } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

const addCollaborators: AddCollaboratorEndpoint = async (context, instData) => {
    const result = validate(instData.data, addCollaboratorsJoiSchema);
    const collaborators = result.collaborators;
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, result.blockId);

    await canReadBlock({ user, block });

    if (block.type !== BlockType.Org) {
        throw new InvalidRequestError();
    }

    const { indexedExistingUsers } = await filterNewCollaborators(context, {
        block,
        collaborators,
    });

    const now = getDate();

    const collaborationRequests = collaborators.map((request) => {
        const notificationBody =
            request.body ||
            `You have been invited by ${user.name} to collaborate in ${block.name}.`;

        return {
            customId: request.customId,
            from: {
                userId: user.customId,
                name: user.name,
                blockId: block.customId,
                blockName: block.name,
                blockType: block.type,
            },
            createdAt: now,
            body: notificationBody,
            to: {
                email: request.email,
            },
            type: NotificationType.NewCollaborationRequest,
            expiresAt: request.expiresAt as any,
            statusHistory: [
                {
                    status: CollaborationRequestStatusType.Pending,
                    date: now,
                },
            ],
            sentEmailHistory: [],
        } as INotification;
    });

    await context.notification.bulkSaveCollaborationRequests(
        context,
        collaborationRequests
    );

    broadcastToOrgsAndExistingUsers(context, instData, {
        block,
        collaborationRequests,
        indexedExistingUsers,
    });

    // TODO: maybe deffer sending email till end of day
    fireAndForgetPromise(
        sendEmails(context, instData, {
            user,
            block,
            indexedExistingUsers,
            requests: collaborationRequests,
        })
    );

    return { requests: collaborationRequests };
};

export default addCollaborators;
