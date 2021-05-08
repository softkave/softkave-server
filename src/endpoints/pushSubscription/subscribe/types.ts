import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISubscribePushSubscriptionParameters {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export type SubscribePushSubscriptionEndpoint = Endpoint<
    IBaseContext,
    ISubscribePushSubscriptionParameters
>;
