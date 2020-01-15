import Joi from "joi";
import moment from "moment";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import NotificationModel from "../../mongo/notification/NotificationModel";
import UserModel from "../../mongo/user/UserModel";
import appInfo from "../../res/appInfo";
import { indexArray } from "../../utils/functionUtils";
import { validate } from "../../utils/joiUtils";
import {
  notificationErrorFields,
  notificationErrorMessages
} from "../../utils/notificationError";
import OperationError from "../../utils/OperationError";
import { notificationConstants } from "../notification/constants";
import { IUser, IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import sendCollabRequestEmail from "./sendCollabRequestEmail";
import { addCollaboratorCollaboratorsSchema } from "./validation";

// TODO:  define all any types

function isRequestAccepted(request: any) {
  if (Array.isArray(request.statusHistory)) {
    return !!request.statusHistory.find((status: any) => {
      return (
        status.status ===
        notificationConstants.collaborationRequestStatusTypes.accepted
      );
    });
  }

  return false;
}

const addCollaboratorJoiSchema = Joi.object().keys({
  collaborators: addCollaboratorCollaboratorsSchema
});

interface INewCollaborator {
  email: string;
  body: string;
  expiresAt: number;
  customId: string;
}

export interface IAddCollaboratorsProps {
  block: IBlockDocument;
  collaborators: INewCollaborator[];
  user: IUserDocument;
  notificationModel: NotificationModel;
  accessControlModel: AccessControlModel;
  userModel: UserModel;
}

async function addCollaborator({
  block,
  collaborators,
  user,
  notificationModel,
  accessControlModel,
  userModel
}: IAddCollaboratorsProps) {
  const result = validate({ collaborators }, addCollaboratorJoiSchema);
  collaborators = result.collaborators;

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.ADD_COLLABORATOR
  });

  const collaboratorsEmailArr = collaborators.map((collaborator: any) => {
    return collaborator.email.toLowerCase();
  });

  const indexedNewCollaborators = indexArray(collaborators, {
    path: "email",
    reducer: (data: any, arr: any, index: number) => ({
      data,
      index
    })
  });

  const existingUsersQuery = {
    email: {
      $in: collaboratorsEmailArr
    }
    // orgs: block.customId
  };

  const existingUsers = await userModel.model
    .find(existingUsersQuery, "email orgs")
    .lean()
    .exec();

  // const indexedExistingUsers = indexArray(existingUsers, {
  //   path: "email"
  // });

  const indexedExistingUsers = {};
  const existingUsersInOrg = [];

  existingUsers.forEach((existingUser: Partial<IUser>) => {
    indexedExistingUsers[existingUser.email] = existingUser;

    if (existingUser.orgs!.indexOf(block.customId) !== -1) {
      existingUsersInOrg.push(existingUser);
    }
  });

  if (existingUsersInOrg.length > 0) {
    const errors = existingUsersInOrg.map((existingUser: Partial<IUser>) => {
      const indexedNewCollaborator =
        indexedNewCollaborators[existingUser.email];

      return new OperationError(
        notificationErrorFields.sendingRequestToAnExistingCollaborator,
        notificationErrorMessages.sendingRequestToAnExistingCollaborator,
        `collaborators.${indexedNewCollaborator.index}.email`
      );
    });

    throw errors;
  }

  const existingCollabReqQuery = {
    "to.email": {
      $in: collaboratorsEmailArr
    },
    "from.blockId": block.customId
  };

  const existingCollaborationRequests = await notificationModel.model
    .find(existingCollabReqQuery, "to.email createdAt")
    .lean()
    .exec();

  if (existingCollaborationRequests.length > 0) {
    const errors = existingCollaborationRequests.map((request: any) => {
      const indexedNewCollaborator = indexedNewCollaborators[request.to.email];
      if (isRequestAccepted(request)) {
        return new OperationError(
          notificationErrorFields.sendingRequestToAnExistingCollaborator,
          notificationErrorMessages.sendingRequestToAnExistingCollaborator,
          `collaborators.${indexedNewCollaborator.index}.email`
        );
      } else {
        return new OperationError(
          notificationErrorFields.requestHasBeenSentBefore,
          notificationErrorMessages.requestHasBeenSentBefore,
          `collaborators.${indexedNewCollaborator.index}.email`
        );
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

    // TODO: Define type
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
      type: notificationConstants.notificationTypes.collaborationRequest,
      expiresAt: request.expiresAt || null,
      statusHistory: [
        {
          status: notificationConstants.collaborationRequestStatusTypes.pending,
          date: Date.now()
        }
      ]
    };
  });

  await notificationModel.model.insertMany(collaborationRequests);

  // TODO: maybe deffer sending email till end of day
  sendEmails(collaborationRequests);

  function sendEmails(collaborationRequestsParam: any) {
    const emailPromises = collaborationRequestsParam.map((request: any) => {
      return sendCollabRequestEmail({
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
    emailPromises.forEach(async (promise: Promise<any>, index: number) => {
      try {
        await promise;
        const request = collaborationRequestsParam[index];
        notificationModel
          .newModel()
          .updateOne(
            {
              customId: request.customId
            },
            {
              $push: {
                sentEmailHistory: {
                  date: Date.now()
                }
              }
            }
          )
          .exec();
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default addCollaborator;
