import moment from "moment";
import { INotification } from "mongo/notification";
import { IUser } from "mongo/user";
import appInfo from "res/appInfo";
import { indexArray } from "utils/functionUtils";
import { validate } from "utils/joiUtils";
import logger from "utils/logger";
import canReadBlock from "../canReadBlock";
import {
  CollaborationRequestSentBeforeError,
  CollaboratorExistsInOrgError
} from "../errors";
import { IAddCollaboratorsContext } from "./types";
import { addCollaboratorsJoiSchema } from "./validation";

function isRequestAccepted(request: INotification) {
  if (Array.isArray(request.statusHistory)) {
    return !!request.statusHistory.find(status => {
      return status.status === "accepted";
    });
  }

  return false;
}

async function addCollaborators(
  context: IAddCollaboratorsContext
): Promise<void> {
  const result = validate(context.data, addCollaboratorsJoiSchema);
  const collaborators = result.collaborators;
  const user = await context.getUser();
  const block = await context.getBlockByID(result.customId);

  // TODO: should we pass only the block ID, since that's all it uses?
  await canReadBlock({ user, block });

  const collaboratorsEmailArr = collaborators.map((collaborator: any) => {
    return collaborator.email;
  });

  const indexedNewCollaborators = indexArray(collaborators, {
    path: "email",
    reducer: (data: any, arr: any, index: number) => ({
      data,
      index
    })
  });

  const existingUsers = await context.getUserListByEmail(collaboratorsEmailArr);

  const indexedExistingUsers = {};
  const existingUsersInOrg = [];

  existingUsers.forEach((existingUser: IUser) => {
    indexedExistingUsers[existingUser.email] = existingUser;

    if (existingUser.orgs!.indexOf(block.customId) !== -1) {
      existingUsersInOrg.push(existingUser);
    }
  });

  if (existingUsersInOrg.length > 0) {
    const errors = existingUsersInOrg.map((existingUser: Partial<IUser>) => {
      const indexedNewCollaborator =
        indexedNewCollaborators[existingUser.email];

      return new CollaboratorExistsInOrgError({
        field: `collaborators.${indexedNewCollaborator.index}.email`
      });
    });

    throw errors;
  }

  const existingCollaborationRequests = await context.getExistingCollaborationRequests(
    collaboratorsEmailArr,
    block.customId
  );

  if (existingCollaborationRequests.length > 0) {
    const errors = existingCollaborationRequests.map((request: any) => {
      const indexedNewCollaborator = indexedNewCollaborators[request.to.email];
      if (isRequestAccepted(request)) {
        return new CollaboratorExistsInOrgError({
          field: `collaborators.${indexedNewCollaborator.index}.email`
        });
      } else {
        return new CollaborationRequestSentBeforeError({
          field: `collaborators.${indexedNewCollaborator.index}.email`
        });
      }
    });

    throw errors;
  }

  const collaborationRequests = collaborators.map(request => {
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
        blockType: block.type
      },
      createdAt: Date.now(),
      body: notificationBody,
      to: {
        email: request.email.toLowerCase()
      },
      type: "collab-req",
      expiresAt: request.expiresAt || null,
      statusHistory: [
        {
          status: "pending",
          date: Date.now()
        }
      ]
    } as INotification;
  });

  await context.saveNotifications(collaborationRequests);

  // TODO: maybe deffer sending email till end of day
  sendEmails(collaborationRequests);

  function sendEmails(collaborationRequestsParam: INotification[]) {
    const emailPromises = collaborationRequestsParam.map(request => {
      return context.sendCollaborationRequestEmail({
        email: request.to.email,
        senderName: user.name,
        senderOrg: block.name,
        message: request.body,
        expiration: request.expiresAt ? moment(request.expiresAt) : null,
        loginLink: `${appInfo.clientDomain}/login`,
        recipientIsUser: !!indexedExistingUsers[request.to.email],
        signupLink: `${appInfo.clientDomain}/signup`
      });
    });

    // TODO: Resend collaboration requests that have not been sent or that failed
    emailPromises.forEach(async (promise: Promise<void>, index: number) => {
      promise
        .then(() => {
          const request: INotification = collaborationRequestsParam[index];
          const sentEmailHistory = request.sentEmailHistory.concat({
            date: Date.now()
          });

          context.updateNotificationByID(request.customId, {
            sentEmailHistory
          });
        })
        .catch(error => {
          // Fire and forget
          // TODO: log the time endpoints and specific operations take, for improvements
          logger.error(error);
        });
    });
  }
}

export default addCollaborators;
