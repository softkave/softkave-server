import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import {
    CollaborationRequestEmailReason,
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaboration-request/definitions";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getCollaborationRequestRevokedNotification } from "../../notifications/templates/collaborationRequest";
import {
    CollaborationRequestAcceptedError,
    CollaborationRequestDeclinedError,
    CollaborationRequestDoesNotExistError,
} from "../../user/errors";
import { fireAndForganizationetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import {
    IRevokeCollaborationRequestContext,
    RevokeCollaborationRequestsEndpoint,
} from "./types";
import { revokeRequestJoiSchema } from "./validation";

async function notifyRecipient(
    context: IRevokeCollaborationRequestContext,
    organization: IBlock,
    request: ICollaborationRequest
) {
    const recipient = await context.user.getUserByEmail(
        context,
        request.to.email
    );

    if (recipient) {
        const notification = getCollaborationRequestRevokedNotification(
            organization,
            recipient,
            request
        );

        fireAndForganizationetPromise(
            context.notification.bulkSaveNotifications(context, [notification])
        );
    } else {
        try {
            await context.sendCollaborationRequestRevokedEmail({
                email: request.to.email,
                senderName: organization.name,
                title: `Collaboration request from ${organization.name} revoked`,
            });

            context.collaborationRequest.updateCollaborationRequestById(
                context,
                request.customId,
                {
                    sentEmailHistory: request.sentEmailHistory.concat({
                        date: getDate(),
                        reason: CollaborationRequestEmailReason.RequestRevoked,
                    }),
                }
            );
        } catch (error) {
            console.error(error);
        }
    }
}

const revokeCollaborationRequest: RevokeCollaborationRequestsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, revokeRequestJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.getBlockById(
        context,
        data.blockId
    );

    assertBlock(organization);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(organization),
    //         resourceType: SystemResourceType.CollaborationRequest,
    //         action: SystemActionType.RevokeRequest,
    //         permissionResourceId: organization.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: organization });

    let request =
        await context.collaborationRequest.getCollaborationRequestById(
            context,
            data.requestId
        );

    if (!request || request.from.blockId !== organization.customId) {
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

    request = await context.collaborationRequest.updateCollaborationRequestById(
        context,
        request.customId,
        {
            statusHistory,
        }
    );

    fireAndForganizationetPromise(
        notifyRecipient(context, organization, request)
    );
};

export default revokeCollaborationRequest;
