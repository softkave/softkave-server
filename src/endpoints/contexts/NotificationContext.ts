import {
    INotification,
    INotificationSubscription,
} from "../../mongo/notification";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
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
    getNotificationsByOrgId: (
        ctx: IBaseContext,
        orgId: string
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
    public markUserNotificationsRead = wrapFireAndThrowError(
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

    public getNotificationById = wrapFireAndThrowError(
        (ctx: IBaseContext, id: string, userId: string) => {
            return ctx.models.notificationModel.model
                .findOne({ customId: id, recipientId: userId })
                .lean()
                .exec();
        }
    );

    public getUserNotificationsById = wrapFireAndThrowError(
        (ctx: IBaseContext, ids: string[], userId: string) => {
            return ctx.models.notificationModel.model
                .find({ customId: { $in: ids }, recipientId: userId })
                .lean()
                .exec();
        }
    );

    public updateNotificationById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string, data: Partial<INotification>) => {
            return ctx.models.notificationModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public getUserNotifications = wrapFireAndThrowError(
        (ctx: IBaseContext, userId: string) => {
            return ctx.models.notificationModel.model
                .find({
                    recipientId: userId,
                })
                .lean()
                .exec();
        }
    );

    public deleteNotificationById = wrapFireAndThrowError(
        async (ctx: IBaseContext, id: string) => {
            await ctx.models.notificationModel.model
                .deleteOne({ customId: id })
                .exec();
        }
    );

    public bulkSaveNotifications = wrapFireAndThrowError(
        (ctx: IBaseContext, notifications: INotification[]) => {
            return ctx.models.notificationModel.model.insertMany(notifications);
        }
    );

    public getNotificationsByOrgId = wrapFireAndThrowError(
        (ctx: IBaseContext, orgId: string) => {
            return ctx.models.notificationModel.model
                .find({
                    orgId,
                })
                .lean()
                .exec();
        }
    );

    public getNotificationSubscriptionById = wrapFireAndThrowError(
        (ctx: IBaseContext, id: string) => {
            return ctx.models.notificationSubscriptionModel.model
                .findOne({
                    customId: id,
                })
                .lean()
                .exec();
        }
    );

    public updateNotificationSubscriptionById = wrapFireAndThrowError(
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

    public bulkSaveNotificationSubscriptions = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            notificationSubscriptions: INotificationSubscription[]
        ) => {
            return ctx.models.notificationSubscriptionModel.model.insertMany(
                notificationSubscriptions
            );
        }
    );

    public getNotificationSubscriptionsByResourceId = wrapFireAndThrowError(
        (ctx: IBaseContext, resourceId: string) => {
            return ctx.models.notificationSubscriptionModel.model
                .find({
                    resourceId,
                })
                .lean()
                .exec();
        }
    );

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

export const getNotificationContext = makeSingletonFunc(
    () => new NotificationContext()
);
