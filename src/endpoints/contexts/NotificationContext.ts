import { INotification, INotificationModel } from "../../mongo/notification";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { NotificationDoesNotExistError } from "../notification/errors";

export interface INotificationContextModels {
  notificationModel: INotificationModel;
}

export interface INotificationContext {
  getNotificationById: (
    models: INotificationContextModels,
    id: string
  ) => Promise<INotification | undefined>;
  getUserNotifications: (
    models: INotificationContextModels,
    email: string
  ) => Promise<INotification[] | undefined>;
  updateNotificationById: (
    models: INotificationContextModels,
    customId: string,
    data: Partial<INotification>,
    ensureNotificationExists?: boolean
  ) => Promise<boolean | undefined>;
  deleteNotificationById: (
    models: INotificationContextModels,
    customId: string
  ) => Promise<void>;
  getCollaborationRequestsByRecipientEmail: (
    models: INotificationContextModels,
    emails: string[],
    blockId: string
  ) => Promise<INotification[]>;
  bulkSaveNotifications: (
    models: INotificationContextModels,
    notifications: INotification[]
  ) => Promise<void>;
  getNotificationsByBlockId: (
    models: INotificationContextModels,
    blockId: string
  ) => Promise<INotification[]>;
  saveNotification: (
    models: INotificationContextModels,
    notification: INotification
  ) => Promise<void>;
}

export default class NotificationContext implements INotificationContext {
  public async getNotificationById(
    models: INotificationContextModels,
    id: string
  ) {
    try {
      return await models.notificationModel.model
        .findOne({ customId: id })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateNotificationById(
    models: INotificationContextModels,
    customId: string,
    data: Partial<INotification>,
    ensureNotificationExists?: boolean
  ) {
    try {
      if (ensureNotificationExists) {
        const notification = await models.notificationModel.model
          .findOneAndUpdate({ customId }, data, { fields: "customId" })
          .exec();

        if (notification && notification.customId) {
          return true;
        } else {
          throw new NotificationDoesNotExistError(); // should we include id
        }
      } else {
        await models.notificationModel.model
          .updateOne({ customId }, data)
          .exec();
      }
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getUserNotifications(
    models: INotificationContextModels,
    email: string
  ) {
    try {
      const requests = await models.notificationModel.model
        .find({
          "to.email": email,
        })
        .lean()
        .exec();

      return requests;
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async deleteNotificationById(
    models: INotificationContextModels,
    id: string
  ) {
    try {
      await models.notificationModel.model.deleteOne({ customId: id }).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getCollaborationRequestsByRecipientEmail(
    models,
    emails,
    blockID
  ) {
    try {
      return await models.notificationModel.model
        .find({
          "to.email": {
            $in: emails,
          },
          "from.blockId": blockID,
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkSaveNotifications(models, notifications) {
    try {
      await models.notificationModel.model.insertMany(notifications);
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getNotificationsByBlockId(models, blockId: string) {
    try {
      return await models.notificationModel.model
        .find({
          "from.blockId": blockId,
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async saveNotification(models, notification: INotification) {
    try {
      const n = new models.notificationModel.model(notification);
      n.save();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
