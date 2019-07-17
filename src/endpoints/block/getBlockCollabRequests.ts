import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";

export interface IGetBlockCollaborationRequestsParameters {
  block: IBlockDocument;
  notificationModel: NotificationModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

async function getBlockCollabRequests({
  block,
  notificationModel,
  user,
  accessControlModel
}: IGetBlockCollaborationRequestsParameters) {
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
