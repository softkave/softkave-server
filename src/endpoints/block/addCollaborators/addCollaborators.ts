import moment from "moment";
import {
  CollaborationRequestStatusType,
  INotification,
  NotificationType,
} from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../res/appInfo";
import { getDate, indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { toPublicNotificationData } from "../../notification/utils";
import {
  INewNotificationsPacket,
  OutgoingSocketEvents,
} from "../../socket/server";
import { userIsPartOfOrg } from "../../user/utils";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import {
  CollaborationRequestSentBeforeError,
  CollaboratorExistsInOrgError,
} from "../errors";
import { AddCollaboratorEndpoint } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

function isRequestAccepted(request: INotification) {
  if (Array.isArray(request.statusHistory)) {
    return !!request.statusHistory.find((status) => {
      return status.status === CollaborationRequestStatusType.Accepted;
    });
  }

  return false;
}

const addCollaborators: AddCollaboratorEndpoint = async (context, instData) => {
  const result = validate(instData.data, addCollaboratorsJoiSchema);
  const collaborators = result.collaborators;
  const user = await context.session.getUser(context, instData);
  const block = await context.block.getBlockById(context, result.blockId);

  await canReadBlock({ user, block });

  const newCollaboratorsEmails = collaborators.map((collaborator: any) => {
    return collaborator.email;
  });

  const indexedNewCollaborators = indexArray(collaborators, {
    path: "email",
    reducer: (data, arr, index) => ({
      data,
      index,
    }),
  });

  const existingUsers = await context.user.bulkGetUsersByEmail(
    context,
    newCollaboratorsEmails
  );
  const indexedExistingUsers = {};
  const existingUsersInOrg = [];

  existingUsers.forEach((existingUser: IUser) => {
    indexedExistingUsers[existingUser.email] = existingUser;

    if (userIsPartOfOrg(existingUser, block.customId)) {
      existingUsersInOrg.push(existingUser);
    }
  });

  if (existingUsersInOrg.length > 0) {
    const errors = existingUsersInOrg.map((existingUser: Partial<IUser>) => {
      const indexedNewCollaborator =
        indexedNewCollaborators[existingUser.email];

      return new CollaboratorExistsInOrgError({
        field: `collaborators.${indexedNewCollaborator.index}.email`,
      });
    });

    throw errors;
  }

  const existingCollaborationRequests = await context.notification.getCollaborationRequestsByRecipientEmail(
    context,
    newCollaboratorsEmails,
    block.customId
  );

  if (existingCollaborationRequests.length > 0) {
    const errors = existingCollaborationRequests.map((request: any) => {
      const indexedNewCollaborator = indexedNewCollaborators[request.to.email];
      if (isRequestAccepted(request)) {
        return new CollaboratorExistsInOrgError({
          field: `collaborators.${indexedNewCollaborator.index}.email`,
        });
      } else {
        return new CollaborationRequestSentBeforeError({
          field: `collaborators.${indexedNewCollaborator.index}.email`,
        });
      }
    });

    throw errors;
  }

  const now = getDate();

  const collaborationRequests = collaborators.map((request) => {
    const notificationBody =
      request.body ||
      `
      You have been invited by ${user.name} to collaborate in ${block.name}.
    `;

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
      type: NotificationType.CollaborationRequest,
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

  await context.notification.bulkSaveNotifications(
    context,
    collaborationRequests
  );

  const orgBroadcastPacket: INewNotificationsPacket = {
    notifications: collaborationRequests.map(toPublicNotificationData),
  };

  const blockRoomName = context.room.getBlockRoomName(block);
  context.room.broadcast(
    context,
    blockRoomName,
    OutgoingSocketEvents.OrgNewNotifications,
    orgBroadcastPacket
  );

  existingUsers.forEach((existingUser) => {
    // TODO: implement a way to know if the user is logged in, then send notification
  });

  // TODO: maybe deffer sending email till end of day
  sendEmails(collaborationRequests);

  function updateSentEmailHistory(request: INotification) {
    const sentEmailHistory = request.sentEmailHistory.concat({
      date: getDate(),
    });

    fireAndForgetPromise(
      context.notification.updateNotificationById(context, request.customId, {
        sentEmailHistory,
      })
    );
  }

  function sendEmails(collaborationRequestsParam: INotification[]) {
    const emailPromises = collaborationRequestsParam.map((request) => {
      return context.sendCollaborationRequestEmail({
        email: request.to.email,
        senderName: user.name,
        senderOrg: block.name,
        message: request.body,
        expiration: request.expiresAt ? moment(request.expiresAt) : null,
        loginLink: `${appInfo.clientDomain}/login`,
        recipientIsUser: !!indexedExistingUsers[request.to.email],
        signupLink: `${appInfo.clientDomain}/signup`,
      });
    });

    // TODO: Resend collaboration requests that have not been sent or that failed
    emailPromises.forEach(async (promise: Promise<void>, index: number) => {
      fireAndForgetPromise(promise).then(() => {
        const request: INotification = collaborationRequestsParam[index];
        updateSentEmailHistory(request);
      });
    });
  }
};

export default addCollaborators;
