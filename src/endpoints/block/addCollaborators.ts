import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { validate } from "../../utils/joi-utils";
import {
  notificationErrorFields,
  notificationErrorMessages
} from "../../utils/notificationError";
import OperationError from "../../utils/OperationError";
import { indexArray } from "../../utils/utils";
import { notificationConstants } from "../notification/constants";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import sendCollabRequestEmail from "./sendCollabRequestEmail";
import {
  addCollaboratorCollaboratorsSchema,
  blockParamSchema,
  validateAddCollaboratorCollaborators
} from "./validation";

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

// TODO: define all any types
export interface IAddCollaboratorParameters {
  block: IBlockDocument;
  collaborators: any;
  user: IUserDocument;
  notificationModel: NotificationModel;
  accessControlModel: AccessControlModel;
}

async function addCollaborator({
  block,
  collaborators,
  user,
  notificationModel,
  accessControlModel
}: IAddCollaboratorParameters) {
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
    const idc = indexArray(collaborators, {
      path: "email",
      reducer: (data: any, arr: any, index: number) => ({
        data,
        index
      })
    });

    const errors = existingCollaborationRequests.map((request: any) => {
      const idcItem = idc[request.to.email];
      if (isRequestAccepted(request)) {
        // TODO: think on how the field should be determined, should it be namespaced to variables or justfields
        return new OperationError(
          notificationErrorFields.sendingRequestToAnExistingCollaborator,
          notificationErrorMessages.sendingRequestToAnExistingCollaborator,
          `collaborators.${idcItem.index}.email`
        );
      } else {
        return new OperationError(
          notificationErrorFields.requestHasBeenSentBefore,
          notificationErrorMessages.requestHasBeenSentBefore,
          `collaborators.${idcItem.index}.email`
        );
      }
    });

    throw errors;
  }

  const collaborationRequests = collaborators.map((request: any) => {
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
        blockName: block.name
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
        userName: user.name,
        blockName: block.name,
        message: request.body,
        expires: request.expiresAt
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
