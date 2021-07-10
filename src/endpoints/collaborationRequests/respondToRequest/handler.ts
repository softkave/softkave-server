import { CollaborationRequestStatusType } from "../../../mongo/collaboration-request";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getPublicBlockData } from "../../block/utils";
import { PermissionDeniedError } from "../../errors";
import {
    CollaborationRequestAcceptedError,
    CollaborationRequestDeclinedError,
    CollaborationRequestRevokedError,
} from "../../user/errors";
import { userIsPartOfOrg } from "../../user/utils";
import { RespondToCollaborationRequestEndpoint } from "./types";
import { respondToCollaborationRequestJoiSchema } from "./validation";
import { IOrganization } from "../../org/types";
import { throwOrgNotFoundError } from "../../org/utils";

// @ts-ignore
const respondToRequest: RespondToCollaborationRequestEndpoint = async (
    context,
    instData
) => {
    const data = validate(
        instData.data,
        respondToCollaborationRequestJoiSchema
    );

    let user = await context.session.getUser(context, instData);
    const request =
        await context.collaborationRequest.assertGetCollaborationRequestById(
            context,
            data.requestId
        );

    if (request.to.email !== user.email) {
        throw new PermissionDeniedError();
    }

    if (request.statusHistory) {
        const currentStatus =
            request.statusHistory[request.statusHistory.length - 1];

        switch (currentStatus.status) {
            case CollaborationRequestStatusType.Accepted:
                throw new CollaborationRequestAcceptedError();

            case CollaborationRequestStatusType.Declined:
                throw new CollaborationRequestDeclinedError();

            case CollaborationRequestStatusType.Revoked:
                throw new CollaborationRequestRevokedError();
        }
    }

    const statusHistory = request.statusHistory || [];
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

    await context.collaborationRequest.updateCollaborationRequestById(
        context,
        data.requestId,
        {
            statusHistory,
        }
    );

    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        request.from.blockId,
        throwOrgNotFoundError
    );

    const publicOrg = getPublicBlockData(org);

    context.broadcastHelpers.broadcastCollaborationRequestResponse(
        context,
        instData,
        user,
        request,
        data.response,
        respondedAtStr,
        publicOrg
    );

    if (userAccepted) {
        if (!userIsPartOfOrg(user, org.customId)) {
            const userOrgs = user.orgs.concat({
                customId: org.customId,
            });

            user = await context.user.updateUserById(context, user.customId, {
                orgs: userOrgs,
            });

            return { org: publicOrg, respondedAt: respondedAtStr };
        }
    }

    return { respondedAt: respondedAtStr };
};

export default respondToRequest;
