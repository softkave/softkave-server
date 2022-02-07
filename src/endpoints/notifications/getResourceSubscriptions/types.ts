import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicNotificationSubscription } from "../types";

export interface IGetResourceSubscriptionsParameters {
    blockId: string;
}

export interface IGetResourceSubscriptionsResult {
    subscriptions: IPublicNotificationSubscription[];
}

export type GetResourceSubscriptionsEndpoint = Endpoint<
    IBaseContext,
    IGetResourceSubscriptionsParameters,
    IGetResourceSubscriptionsResult
>;
