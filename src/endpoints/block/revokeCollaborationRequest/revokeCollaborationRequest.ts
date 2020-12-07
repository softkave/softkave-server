import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaborationRequest/definitions";
import { validate } from "../../../utilities/joiUtils";
import { IBaseContext } from "../../contexts/BaseContext";
import { getCollaborationRequestRevokedNotification } from "../../notifications/templates/collaborationRequest";
import {
    CollaborationRequestAcceptedError,
    CollaborationRequestDeclinedError,
    CollaborationRequestDoesNotExistError,
} from "../../user/errors";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import {
    IRevokeCollaborationRequestContext,
    RevokeCollaborationRequestsEndpoint,
} from "./types";
import { revokeRequestJoiSchema } from "./validation";

async function notifyRecipient(
    context: IRevokeCollaborationRequestContext,
    org: IBlock,
    request: ICollaborationRequest
) {
    const recipient = await context.user.getUserByEmail(
        context,
        request.to.email
    );

    if (recipient) {
        const notification = getCollaborationRequestRevokedNotification(
            org,
            recipient,
            request
        );

        fireAndForgetPromise(
            context.notification.bulkSaveNotifications(context, [notification])
        );
    } else {
        fireAndForgetPromise(
            context.sendCollaborationRequestRevokedEmail({
                email: request.to.email,
                senderName: org.name,
                title: `Collaboration request from ${org.name} revoked`,
            })
        );
    }
}

const revokeCollaborationRequest: RevokeCollaborationRequestsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, revokeRequestJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.getBlockById(context, data.blockId);

    assertBlock(org);
    await context.accessControl.assertPermission(
        context,
        getBlockRootBlockId(org),
        {
            resourceType: SystemResourceType.CollaborationRequest,
            action: SystemActionType.RevokeRequest,
            permissionResourceId: org.permissionResourceId,
        },
        user
    );

    const request = await context.collaborationRequest.getCollaborationRequestById(
        context,
        data.requestId
    );

    if (!request || request.from.blockId !== org.customId) {
        throw new CollaborationRequestDoesNotExistError();
    }

    const statusHistory = request.statusHistory;

    statusHistory.find((status) => {
        if (status.status === CollaborationRequestStatusType.Accepted) {
            throw new CollaborationRequestAcceptedError();
        } else if (status.status === CollaborationRequestStatusType.Declined) {
            throw new CollaborationRequestDeclinedError();
        }
    });

    statusHistory.push({
        status: CollaborationRequestStatusType.Revoked,
        date: new Date(),
    });

    await context.collaborationRequest.updateCollaborationRequestById(
        context,
        request.customId,
        {
            statusHistory,
        }
    );
};

export default revokeCollaborationRequest;
