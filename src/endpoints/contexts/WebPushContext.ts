import { RequestOptions, SendResult } from "web-push";
import { IClient } from "../../mongo/client";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { wrapFireAndDontThrow } from "../utils";
import { IBaseContext } from "./BaseContext";

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
    sendNotification = wrapFireAndDontThrow(
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

export const getWebPushContext = makeSingletonFunc(() => new WebPushContext());
