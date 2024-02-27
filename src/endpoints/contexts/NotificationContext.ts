import {SystemResourceType} from '../../models/system';
import {INotification, INotificationSubscription} from '../../mongo/notification/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getNewId02} from '../../utilities/ids';
import {saveNewItemToDb} from '../utils';
import {IBaseContext} from './IBaseContext';

export interface INotificationContext {
  // Notifications
  getNotificationById: (
    ctx: IBaseContext,
    id: string,
    userId: string
  ) => Promise<INotification | null>;
  getUserNotificationsById: (
    ctx: IBaseContext,
    ids: string[],
    userId: string
  ) => Promise<INotification[]>;
  getUserNotifications: (ctx: IBaseContext, userId: string) => Promise<INotification[] | null>;
  updateNotificationById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<INotification>
  ) => Promise<INotification | null>;
  deleteNotificationById: (ctx: IBaseContext, customId: string) => Promise<void>;
  bulkSaveNotifications: (
    ctx: IBaseContext,
    notifications: INotification[]
  ) => Promise<INotification[]>;
  getNotificationsByOrganizationId: (
    ctx: IBaseContext,
    organizationId: string
  ) => Promise<INotification[]>;
  markUserNotificationsRead: (
    ctx: IBaseContext,
    userId: string,
    notifications: Array<{
      customId: string;
      readAt: string | number | Date;
    }>
  ) => Promise<void>;

  // Notification subscriptions
  getNotificationSubscriptionById: (
    ctx: IBaseContext,
    id: string
  ) => Promise<INotificationSubscription | null>;
  updateNotificationSubscriptionById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<INotificationSubscription>
  ) => Promise<INotificationSubscription | null>;
  bulkSaveNotificationSubscriptions: (
    ctx: IBaseContext,
    notificationSubscriptions: INotificationSubscription[]
  ) => Promise<INotificationSubscription[]>;
  getNotificationSubscriptionsByResourceId: (
    ctx: IBaseContext,
    resourceId: string
  ) => Promise<INotificationSubscription[]>;
}

export default class NotificationContext implements INotificationContext {
  markUserNotificationsRead = async (
    ctx: IBaseContext,
    userId: string,
    notifications: Array<{
      customId: string;
      readAt: string | number | Date;
    }>
  ) => {
    await ctx.models.notification.model.bulkWrite(
      notifications.map(n => {
        return {
          updateOne: {
            filter: {
              customId: n.customId,
              recipientId: userId,
            },
            update: {readAt: n.readAt},
          },
        };
      })
    );
  };

  getNotificationById = (ctx: IBaseContext, id: string, userId: string) => {
    return ctx.models.notification.model.findOne({customId: id, recipientId: userId}).lean().exec();
  };

  getUserNotificationsById = (ctx: IBaseContext, ids: string[], userId: string) => {
    return ctx.models.notification.model
      .find({customId: {$in: ids}, recipientId: userId})
      .lean()
      .exec();
  };

  updateNotificationById = (ctx: IBaseContext, customId: string, data: Partial<INotification>) => {
    return ctx.models.notification.model
      .findOneAndUpdate({customId}, data, {new: true})
      .lean()
      .exec();
  };

  getUserNotifications = (ctx: IBaseContext, userId: string) => {
    return ctx.models.notification.model
      .find({
        recipientId: userId,
      })
      .lean()
      .exec();
  };

  deleteNotificationById = async (ctx: IBaseContext, id: string) => {
    await ctx.models.notification.model.deleteOne({customId: id}).exec();
  };

  bulkSaveNotifications = (ctx: IBaseContext, notifications: INotification[]) => {
    return ctx.models.notification.model.insertMany(notifications);
  };

  getNotificationsByOrganizationId = (ctx: IBaseContext, organizationId: string) => {
    return ctx.models.notification.model
      .find({
        organizationId,
      })
      .lean()
      .exec();
  };

  getNotificationSubscriptionById = (ctx: IBaseContext, id: string) => {
    return ctx.models.notificationSubscription.model
      .findOne({
        customId: id,
      })
      .lean()
      .exec();
  };

  updateNotificationSubscriptionById = (
    ctx: IBaseContext,
    customId: string,
    data: Partial<INotificationSubscription>
  ) => {
    return ctx.models.notificationSubscription.model
      .findOneAndUpdate(
        {
          customId,
        },
        data,
        {new: true}
      )
      .lean()
      .exec();
  };

  bulkSaveNotificationSubscriptions = (
    ctx: IBaseContext,
    notificationSubscriptions: INotificationSubscription[]
  ) => {
    return ctx.models.notificationSubscription.model.insertMany(notificationSubscriptions);
  };

  getNotificationSubscriptionsByResourceId = (ctx: IBaseContext, resourceId: string) => {
    return ctx.models.notificationSubscription.model
      .find({
        resourceId,
      })
      .lean()
      .exec();
  };

  async saveNotification(ctx: IBaseContext, notification: Omit<INotification, 'customId'>) {
    const notificationDoc = new ctx.models.notification.model(notification);
    return saveNewItemToDb(() => {
      notificationDoc.customId = getNewId02(SystemResourceType.Notification);
      notificationDoc.save();
      return notificationDoc;
    });
  }
}

export const getNotificationContext = makeSingletonFn(() => new NotificationContext());
