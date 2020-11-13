import { INotification } from "../../mongo/notification";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
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
        data: Partial<INotification>
    ) => Promise<INotification | undefined>;
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
    ) => Promise<INotification[]>;
    bulkUpdateNotificationsById: (
        ctx: IBaseContext,
        notifications: Array<IUpdateItemById<INotification>>
    ) => Promise<void>;
    getNotificationsByBlockId: (
        ctx: IBaseContext,
        blockId: string
    ) => Promise<INotification[]>;
    saveNotification: (
        ctx: IBaseContext,
        notification: Omit<INotification, "customId">
    ) => Promise<INotification>;
}

export default class NotificationContext implements INotificationContext {
    public getNotificationById = wrapFireAndThrowError(
        (ctx: IBaseContext, id: string) => {
            return ctx.models.notificationModel.model
                .findOne({ customId: id })
                .lean()
                .exec();
        }
    );

    public updateNotificationById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string, data: Partial<INotification>) => {
            return ctx.models.notificationModel.model
                .findOneAndUpdate({ customId }, data)
                .lean()
                .exec();
        }
    );

    public getUserNotifications = wrapFireAndThrowError(
        (ctx: IBaseContext, email: string) => {
            return ctx.models.notificationModel.model
                .find({
                    "to.email": email,
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

    public getCollaborationRequestsByRecipientEmail = wrapFireAndThrowError(
        (ctx: IBaseContext, emails: string[], blockId: string) => {
            return ctx.models.notificationModel.model
                .find({
                    "to.email": {
                        $in: emails,
                    },
                    "from.blockId": blockId,
                })
                .lean()
                .exec();
        }
    );
    public bulkSaveNotifications = wrapFireAndThrowError(
        (ctx: IBaseContext, notifications: INotification[]) => {
            return ctx.models.notificationModel.model.insertMany(notifications);
        }
    );

    public getNotificationsByBlockId = wrapFireAndThrowError(
        (ctx: IBaseContext, blockId: string) => {
            return ctx.models.notificationModel.model
                .find({
                    "from.blockId": blockId,
                })
                .lean()
                .exec();
        }
    );

    public bulkUpdateNotificationsById = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            notifications: Array<IUpdateItemById<INotification>>
        ) => {
            const opts = notifications.map((notification) => ({
                updateOne: {
                    filter: { customId: notification.id },
                    update: notification.data,
                },
            }));

            await ctx.models.blockModel.model.bulkWrite(opts);
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

export const getNotificationContext = createSingletonFunc(
    () => new NotificationContext()
);
