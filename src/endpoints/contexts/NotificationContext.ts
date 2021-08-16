import {
    INotification,
    INotificationSubscription,
} from "../../mongo/notification";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { saveNewItemToDb, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface INotificationContext {
    // Notifications
    getNotificationById: (
        ctx: IBaseContext,
        id: string,
        userId: string
    ) => Promise<INotification | undefined>;
    getUserNotificationsById: (
        ctx: IBaseContext,
        ids: string[],
        userId: string
    ) => Promise<INotification[]>;
    getUserNotifications: (
        ctx: IBaseContext,
        userId: string
    ) => Promise<INotification[] | undefined>;
    updateNotificationById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<INotification>
    ) => Promise<INotification | undefined>;
    deleteNotificationById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<void>;
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
        userId,
        notifications: Array<{
            customId: string;
            readAt: string | number | Date;
        }>
    ) => Promise<void>;

    // Notification subscriptions
    getNotificationSubscriptionById: (
        ctx: IBaseContext,
        id: string
    ) => Promise<INotificationSubscription | undefined>;
    updateNotificationSubscriptionById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<INotificationSubscription>
    ) => Promise<INotificationSubscription | undefined>;
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
    public markUserNotificationsRead = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            userId,
            notifications: Array<{
                customId: string;
                readAt: string | number | Date;
            }>
        ) => {
            await ctx.models.notificationModel.model.bulkWrite(
                notifications.map((n) => {
                    return {
                        updateOne: {
                            filter: {
                                customId: n.customId,
                                recipientId: userId,
                            },
                            update: { readAt: n.readAt },
                        },
                    };
                })
            );
        }
    );

    public getNotificationById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, id: string, userId: string) => {
            return ctx.models.notificationModel.model
                .findOne({ customId: id, recipientId: userId })
                .lean()
                .exec();
        }
    );

    public getUserNotificationsById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, ids: string[], userId: string) => {
            return ctx.models.notificationModel.model
                .find({ customId: { $in: ids }, recipientId: userId })
                .lean()
                .exec();
        }
    );

    public updateNotificationById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, customId: string, data: Partial<INotification>) => {
            return ctx.models.notificationModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public getUserNotifications = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, userId: string) => {
            return ctx.models.notificationModel.model
                .find({
                    recipientId: userId,
                })
                .lean()
                .exec();
        }
    );

    public deleteNotificationById = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, id: string) => {
            await ctx.models.notificationModel.model
                .deleteOne({ customId: id })
                .exec();
        }
    );

    public bulkSaveNotifications = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, notifications: INotification[]) => {
            return ctx.models.notificationModel.model.insertMany(notifications);
        }
    );

    public getNotificationsByOrganizationId = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, organizationId: string) => {
            return ctx.models.notificationModel.model
                .find({
                    organizationId,
                })
                .lean()
                .exec();
        }
    );

    public getNotificationSubscriptionById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, id: string) => {
            return ctx.models.notificationSubscriptionModel.model
                .findOne({
                    customId: id,
                })
                .lean()
                .exec();
        }
    );

    public updateNotificationSubscriptionById = wrapFireAndThrowErrorAsync(
        (
            ctx: IBaseContext,
            customId: string,
            data: Partial<INotificationSubscription>
        ) => {
            return ctx.models.notificationSubscriptionModel.model
                .findOneAndUpdate(
                    {
                        customId,
                    },
                    data,
                    { new: true }
                )
                .lean()
                .exec();
        }
    );

    public bulkSaveNotificationSubscriptions = wrapFireAndThrowErrorAsync(
        (
            ctx: IBaseContext,
            notificationSubscriptions: INotificationSubscription[]
        ) => {
            return ctx.models.notificationSubscriptionModel.model.insertMany(
                notificationSubscriptions
            );
        }
    );

    public getNotificationSubscriptionsByResourceId =
        wrapFireAndThrowErrorAsync((ctx: IBaseContext, resourceId: string) => {
            return ctx.models.notificationSubscriptionModel.model
                .find({
                    resourceId,
                })
                .lean()
                .exec();
        });

    public async saveNotification(
        ctx: IBaseContext,
        notification: Omit<INotification, "customId">
    ) {
        const notificationDoc = new ctx.models.notificationModel.model(
            notification
        );

        return saveNewItemToDb(() => {
            notificationDoc.customId = getNewId();
            notificationDoc.save();
            return notificationDoc;
        });
    }
}

export const getNotificationContext = getSingletonFunc(
    () => new NotificationContext()
);
