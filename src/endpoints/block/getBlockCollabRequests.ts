import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockParamSchema } from "./validation";

export interface IGetBlockCollaborationRequestsParameters {
  block: IBlockDocument;
  notificationModel: NotificationModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

const getBlockCollabRequestsJoiSchema = Joi.object().keys({});

async function getBlockCollabRequests({
  block,
  notificationModel,
  user,
  accessControlModel
}: IGetBlockCollaborationRequestsParameters) {
  // const result = validate({  }, getBlockCollabRequestsJoiSchema);

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

  const requests = await notificationModel.model
    .find({
      "from.blockId": block.customId
    })
    .lean()
    .exec();

  return {
    requests
  };
}

export default getBlockCollabRequests;
