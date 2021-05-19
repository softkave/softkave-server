import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetPushNotificationKeysResult {
    vapidPublicKey: string;
}

export type GetPushNotificationKeysEndpoint = Endpoint<
    IBaseContext,
    {},
    IGetPushNotificationKeysResult
>;
