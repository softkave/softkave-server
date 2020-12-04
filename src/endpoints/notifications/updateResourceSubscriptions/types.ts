import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUpdateResourceSubscriptionsParameters {
    resourceId: string;
}

export interface IUpdateResourceSubscriptionsResult {
    subscriptions: Array<{
        customId: string;
        updatedAt: string;
        updatedBy: string;
    }>;
}

export type UpdateResourceSubscriptionsEndpoint = Endpoint<
    IBaseContext,
    IUpdateResourceSubscriptionsParameters,
    IUpdateResourceSubscriptionsResult
>;
