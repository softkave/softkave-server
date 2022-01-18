import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { ISubscribePushSubscriptionParameters } from "../subscribe/types";

export interface IPushSubscriptionExistsResult {
    exists: boolean;
}

export type PushSubscriptionExistsEndpoint = Endpoint<
    IBaseContext,
    ISubscribePushSubscriptionParameters,
    IPushSubscriptionExistsResult
>;
