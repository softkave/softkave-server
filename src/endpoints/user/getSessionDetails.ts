import NotificationModel from "../../mongo/notification/NotificationModel";
import BlockModel from "../../mongo/block/BlockModel";
import UserModel from "../../mongo/user/UserModel";
import { IUserDocument } from "./user";
import { blockConstants } from "./constants";


export interface IGetSessionDetails{
  user: IUserDocument;
  notifications: NotificationModel;
  organizations: UserModel;
  assignedTasks: BlockModel;
}


async function getSessionDetails({
  user,
  notifications,
  organizations,
  assignedTasks
}:IGetSessionDetails) {
  const notificationsCount = await notifications.model.count({
      "to.email": user.email
    })
    .lean()
    .exec();

  const assignedTaskCount = await assignedTasks.model.count({
    ["taskCollaborators.userId"]: user.customId,
    type: blockConstants.blockTypes.task
  });

  const organizationsCount = await organizations.model
  .count({
    orgs:user.orgs
  })
  .lean()
  .exec();

  return{
    notificationsCount,
    assignedTaskCount,
    organizationsCount
  };
}

export default getSessionDetails;