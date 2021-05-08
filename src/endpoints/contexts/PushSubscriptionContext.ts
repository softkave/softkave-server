import { IPushSubscription } from "../../mongo/pushSubscriptions";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { PushSubscriptionDoesNotExistError } from "../pushSubscription/errors";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IPushSubscriptionContext {
    savePushSubscription: (
        ctx: IBaseContext,
        pushSubscription: IPushSubscription
    ) => Promise<IPushSubscription>;
    getPushSubscription: (
        ctx: IBaseContext,
        userId: string,
        clientId: string,
        endpoint: string,
        keys: IPushSubscription["keys"]
    ) => Promise<IPushSubscription | null>;
    getPushSubscriptionById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IPushSubscription | null>;
    getPushSubscriptionsByUserId: (
        ctx: IBaseContext,
        userId: string
    ) => Promise<IPushSubscription[]>;
    assertGetPushSubscriptionById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IPushSubscription>;
    deletePushSubscriptionById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<void>;
    deletePushSubscriptionsByUserAndClientId: (
        ctx: IBaseContext,
        userId: string,
        clientId: string
    ) => Promise<void>;
}

export default class PushSubscriptionContext
    implements IPushSubscriptionContext {
    public savePushSubscription = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: IPushSubscription) => {
            const pushSubscription = new ctx.models.pushSubscriptionModel.model(
                data
            );
            return pushSubscription.save();
        }
    );

    public getPushSubscription = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            userId: string,
            clientId: string,
            endpoint: string,
            keys: IPushSubscription["keys"]
        ) => {
            return ctx.models.pushSubscriptionModel.model
                .findOne({
                    userId,
                    clientId,
                    endpoint,
                    "keys.p256dh": keys.p256dh,
                    "keys.auth": keys.auth,
                })
                .lean()
                .exec();
        }
    );

    public getPushSubscriptionById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.pushSubscriptionModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public getPushSubscriptionsByUserId = wrapFireAndThrowError(
        (ctx: IBaseContext, userId: string) => {
            return ctx.models.pushSubscriptionModel.model
                .find({
                    userId,
                })
                .lean()
                .exec();
        }
    );

    public assertGetPushSubscriptionById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            const pushSubscription = await ctx.pushSubscription.getPushSubscriptionById(
                ctx,
                customId
            );

            if (!pushSubscription) {
                throw new PushSubscriptionDoesNotExistError();
            }

            return pushSubscription;
        }
    );

    public deletePushSubscriptionById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            await ctx.models.pushSubscriptionModel.model
                .deleteOne({
                    customId,
                })
                .exec();
        }
    );

    public deletePushSubscriptionsByUserAndClientId = wrapFireAndThrowError(
        async (ctx: IBaseContext, userId: string, clientId: string) => {
            await ctx.models.pushSubscriptionModel.model
                .deleteMany({
                    userId,
                    clientId,
                })
                .exec();
        }
    );
}

export const getPushSubscriptionContext = makeSingletonFunc(
    () => new PushSubscriptionContext()
);
