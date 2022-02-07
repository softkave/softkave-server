import { RequestOptions, SendResult } from "web-push";
import { IClient } from "../../mongo/client";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./IBaseContext";

export interface IWebPushContext {
    sendNotification: (
        ctx: IBaseContext,
        endpoint: string,
        keys: IClient["keys"],
        message?: string | Buffer | null,
        options?: RequestOptions
    ) => Promise<SendResult>;
}

export default class WebPushContext implements IWebPushContext {
    sendNotification = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            endpoint: string,
            keys: IClient["keys"],
            message?: string | Buffer | null,
            options?: RequestOptions
        ) => {
            return await ctx.webPushInstance.sendNotification(
                { endpoint, keys },
                message,
                options
            );
        }
    );
}

export const getWebPushContext = makeSingletonFn(() => new WebPushContext());
