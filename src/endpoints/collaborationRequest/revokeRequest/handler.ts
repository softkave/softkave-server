import {
    CollaborationRequestEmailReason,
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaboration-request/definitions";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getCollaborationRequestRevokedNotification } from "../../notifications/templates/collaborationRequest";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import {
    CollaborationRequestAcceptedError,
    CollaborationRequestDeclinedError,
    CollaborationRequestDoesNotExistError,
} from "../../user/errors";
import { fireAndForgetPromise } from "../../utils";
import { getPublicCollaborationRequest } from "../utils";
import {
    IRevokeCollaborationRequestContext,
    RevokeCollaborationRequestsEndpoint,
} from "./types";
import { revokeRequestJoiSchema } from "./validation";

async function notifyRecipient(
    context: IRevokeCollaborationRequestContext,
    organization: IOrganization,
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

        fireAndForgetPromise(
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

const revokeRequest: RevokeCollaborationRequestsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, revokeRequestJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.organizationId,
        throwOrganizationNotFoundError
    );

    canReadOrganization(organization.customId, user);

    let request =
        await context.collaborationRequest.assertGetCollaborationRequestById(
            context,
            data.requestId
        );

    if (request.from.blockId !== organization.customId) {
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

    const savedRequest =
        await context.collaborationRequest.updateCollaborationRequestById(
            context,
            request.customId,
            {
                statusHistory,
            }
        );

    fireAndForgetPromise(notifyRecipient(context, organization, savedRequest));
    return { request: getPublicCollaborationRequest(savedRequest) };
};

export default revokeRequest;
