import { SystemActionType, SystemResourceType } from "../../../models/system";
import {
  CollaborationRequestEmailReason,
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../mongo/collaboration-request/definitions";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organizations/canReadBlock";
import { IOrganization } from "../../organizations/types";
import { throwOrganizationNotFoundError } from "../../organizations/utils";
import outgoingEventFn from "../../socket/outgoingEventFn";
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
  } else {
    try {
      await context.sendCollaborationRequestRevokedEmail(context, {
        email: request.to.email,
        workspaceName: organization.name,
        loginLink: context.appVariables.loginPath,
        signupLink: context.appVariables.signupPath,
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

  const requestData = getPublicCollaborationRequest(request);
  const recipient = await context.user.getUserByEmail(
    context,
    request.to.email
  );

  if (recipient) {
    outgoingEventFn(
      context,
      SocketRoomNameHelpers.getUserRoomName(recipient.customId),
      {
        actionType: SystemActionType.Update,
        resourceType: SystemResourceType.CollaborationRequest,
        resource: requestData,
      }
    );
  }

  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getOrganizationRoomName(request.from.blockId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestData,
    }
  );

  fireAndForgetPromise(notifyRecipient(context, organization, savedRequest));
  return { request: requestData };
};

export default revokeRequest;
