import { SystemActionType, SystemResourceType } from "../../../models/system";
import {
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../mongo/collaboration-request";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { fireAndForgetPromise } from "../../utils";
import { getPublicCollaborationRequestArray } from "../utils";
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
      body: `
              You have a new collaboration request from
              ${user.name} of ${organization.name}.
            `,
    };

    return newRequest;
  });

  await context.collaborationRequest.bulkSaveCollaborationRequests(
    context,
    collaborationRequests
  );

  // TODO: maybe deffer sending email till end of day
  fireAndForgetPromise(
    sendEmails(context, instData, {
      user,
      organization: organization,
      indexedExistingUsers,
      requests: collaborationRequests,
    })
  );

  const requestListData = getPublicCollaborationRequestArray(
    collaborationRequests
  );

  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getOrganizationRoomName(organization.customId),
    {
      actionType: SystemActionType.Create,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestListData,
    }
  );

  requestListData.forEach((request) => {
    const existingUser = indexedExistingUsers[request.to.email.toLowerCase()];

    if (existingUser) {
      outgoingEventFn(
        context,
        SocketRoomNameHelpers.getUserRoomName(existingUser.customId),
        {
          actionType: SystemActionType.Create,
          resourceType: SystemResourceType.CollaborationRequest,
          resource: request,
        }
      );
    }
  });

  return {
    requests: requestListData,
  };
};

export default addCollaborators;
