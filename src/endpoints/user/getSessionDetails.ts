import BlockModel from "../../mongo/block/BlockModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import { IUserDocument } from "./user";

export interface IGetSessionDetailsProps {
  user: IUserDocument;
  notifications: NotificationModel;
  blockModel: BlockModel;
}

async function getSessionDetails({
  user,
  notifications,
  blockModel
}: IGetSessionDetailsProps) {
  // TODO: add unseen assigned tasks count
  // TODO: add unseen notifications count
  // TODO: don't wait for one request to complete before we start another one
  // We'll implement these ones later

  const notificationsCount = await notifications.model
    .count({
      "to.email": user.email
    })
    .lean()
    .exec();

  const assignedTaskCount = await blockModel.model
    .count({
      ["taskCollaborators.userId"]: user.customId,
      type: "task"
    })
    .exec();

  const organizationsCount = user.orgs.length;

  return {
    notificationsCount,
    assignedTaskCount,
    organizationsCount
  };
}

export default getSessionDetails;
