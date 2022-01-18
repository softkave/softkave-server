import { IBaseContext } from "../../contexts/IBaseContext";
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
