import { CollaborationRequestStatusType } from "../../../mongo/notification";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getPublicBlockData } from "../../block/utils";
import { PermissionDeniedError } from "../../errors";
import {
    CollaborationRequestAcceptedError,
    CollaborationRequestDeclinedError,
    CollaborationRequestDoesNotExistError,
    CollaborationRequestHasExpiredError,
    CollaborationRequestRevokedError,
} from "../errors";
import { userIsPartOfOrg } from "../utils";
import { RespondToCollaborationRequestEndpoint } from "./types";
import { respondToCollaborationRequestJoiSchema } from "./validation";

const respondToCollaborationRequest: RespondToCollaborationRequestEndpoint = async (
    context,
    instData
) => {
    const data = validate(
        instData.data,
        respondToCollaborationRequestJoiSchema
    );
    const user = await context.session.getUser(context, instData);
    const req = await context.notification.getNotificationById(
        context,
        data.requestId
    );

    if (!!!req) {
        throw new CollaborationRequestDoesNotExistError();
    }

    if (req.to.email !== user.email) {
        throw new PermissionDeniedError();
    }

    if (req.statusHistory) {
        const currentStatus = req.statusHistory[req.statusHistory.length - 1];

        switch (currentStatus.status) {
            case CollaborationRequestStatusType.Accepted:
                throw new CollaborationRequestAcceptedError();

            case CollaborationRequestStatusType.Declined:
                throw new CollaborationRequestDeclinedError();

            case CollaborationRequestStatusType.Revoked:
                throw new CollaborationRequestRevokedError();
        }
    }

    if (req.expiresAt && new Date(req.expiresAt) < new Date()) {
        throw new CollaborationRequestHasExpiredError();
    }

    const statusHistory = req.statusHistory || [];
    const userAccepted =
        data.response === CollaborationRequestStatusType.Accepted;
    const respondedAt = getDate();
    const respondedAtStr = getDateString(respondedAt);

    statusHistory.push({
        status: userAccepted
            ? CollaborationRequestStatusType.Accepted
            : CollaborationRequestStatusType.Declined,
        date: respondedAt,
    });

    await context.notification.updateNotificationById(context, data.requestId, {
        statusHistory,
    });

    const ownerBlock = await context.block.getBlockById(
        context,
        req.from.blockId
    );

    const publicBlock = getPublicBlockData(ownerBlock);

    context.broadcastHelpers.broadcastCollaborationRequestResponse(
        context,
        user,
        req,
        data.response,
        respondedAtStr,
        publicBlock,
        instData
    );

    if (!ownerBlock) {
        // if the org does not exist or has been deleted
        // TODO: should we log something here?
        // TODO: figure our log points, i.e, what are the things we should be logging?
        // TODO: what should we do if the org does not exist?
        // context.notification.deleteNotificationById(context, data.requestId);
    } else if (userAccepted) {
        if (!userIsPartOfOrg(user, ownerBlock.customId)) {
            const userOrgs = user.orgs.concat({
                customId: ownerBlock.customId,
            });

            await context.session.updateUser(context, instData, {
                orgs: userOrgs,
            });

            return { block: publicBlock, respondedAt: respondedAtStr };
        } else {
            // TODO: should we log an error because it means the user already has the org
        }
    }
};

export default respondToCollaborationRequest;
