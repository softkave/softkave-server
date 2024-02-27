import assert = require('assert');
import {RequestOptions, SendResult} from 'web-push';
import {IClientPushNotificationKeys} from '../../mongo/client/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {IBaseContext} from './IBaseContext';

export interface IWebPushContext {
  sendNotification: (
    ctx: IBaseContext,
    endpoint: string,
    keys: IClientPushNotificationKeys,
    message?: string | Buffer | null,
    options?: RequestOptions
  ) => Promise<SendResult>;
}

export default class WebPushContext implements IWebPushContext {
  sendNotification = async (
    ctx: IBaseContext,
    endpoint: string,
    keys: IClientPushNotificationKeys,
    message?: string | Buffer | null,
    options?: RequestOptions
  ) => {
    assert(keys);
    return await ctx.webPushInstance.sendNotification({endpoint, keys}, message, options);
  };
}

export const getWebPushContext = makeSingletonFn(() => new WebPushContext());
