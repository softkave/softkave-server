import { INotification } from "../../mongo/notification";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { NotificationDoesNotExistError } from "../notification/errors";
import { IBaseContext } from "./BaseContext";

export interface INotificationContext {
  getNotificationById: (
    ctx: IBaseContext,
    id: string
  ) => Promise<INotification | undefined>;
  getUserNotifications: (
    ctx: IBaseContext,
    email: string
  ) => Promise<INotification[] | undefined>;
  updateNotificationById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<INotification>,
    ensureNotificationExists?: boolean
  ) => Promise<boolean | undefined>;
  deleteNotificationById: (
    ctx: IBaseContext,
    customId: string
  ) => Promise<void>;
  getCollaborationRequestsByRecipientEmail: (
    ctx: IBaseContext,
    emails: string[],
    blockId: string
  ) => Promise<INotification[]>;
  bulkSaveNotifications: (
    ctx: IBaseContext,
    notifications: INotification[]
  ) => Promise<void>;
  getNotificationsByBlockId: (
    ctx: IBaseContext,
    blockId: string
  ) => Promise<INotification[]>;
  saveNotification: (
    ctx: IBaseContext,
    notification: INotification
  ) => Promise<void>;
}

export default class NotificationContext implements INotificationContext {
  public async getNotificationById(ctx: IBaseContext, id: string) {
    try {
      return await ctx.models.notificationModel.model
        .findOne({ customId: id })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async updateNotificationById(
    ctx: IBaseContext,
    customId: string,
    data: Partial<INotification>,
    ensureNotificationExists?: boolean
  ) {
    try {
      if (ensureNotificationExists) {
        const notification = await ctx.models.notificationModel.model
          .findOneAndUpdate({ customId }, data, { fields: "customId" })
          .exec();

        if (notification && notification.customId) {
          return true;
        } else {
          throw new NotificationDoesNotExistError(); // should we include id
        }
      } else {
        await ctx.models.notificationModel.model
          .updateOne({ customId }, data)
          .exec();
      }
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getUserNotifications(ctx: IBaseContext, email: string) {
    try {
      const requests = await ctx.models.notificationModel.model
        .find({
          "to.email": email,
        })
        .lean()
        .exec();

      return requests;
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async deleteNotificationById(ctx: IBaseContext, id: string) {
    try {
      await ctx.models.notificationModel.model
        .deleteOne({ customId: id })
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getCollaborationRequestsByRecipientEmail(
    ctx: IBaseContext,
    emails: string[],
    blockId: string
  ) {
    try {
      return await ctx.models.notificationModel.model
        .find({
          "to.email": {
            $in: emails,
          },
          "from.blockId": blockId,
        })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async bulkSaveNotifications(
    ctx: IBaseContext,
    notifications: INotification[]
  ) {
    try {
      await ctx.models.notificationModel.model.insertMany(notifications);
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getNotificationsByBlockId(ctx: IBaseContext, blockId: string) {
    try {
      return await ctx.models.notificationModel.model
        .find({
          "from.blockId": blockId,
        })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async saveNotification(
    ctx: IBaseContext,
    notification: INotification
  ) {
    try {
      const n = new ctx.models.notificationModel.model(notification);
      n.save();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }
}

export const getNotificationContext = createSingletonFunc(
  () => new NotificationContext()
);
