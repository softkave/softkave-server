import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetPushSubscriptionKeysResult {
    vapidPublicKey: string;
}

export type GetPushSubscriptionKeysEndpoint = Endpoint<
    IBaseContext,
    {},
    IGetPushSubscriptionKeysResult
>;
