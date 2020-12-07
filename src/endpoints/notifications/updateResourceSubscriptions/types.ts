import { SystemResourceType } from "../../../models/system";
import { NotificationReason } from "../../../mongo/notification";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export type SubscriptionResourceTypes =
    | SystemResourceType.Org
    | SystemResourceType.Board
    | SystemResourceType.Task
    | SystemResourceType.CollaborationRequest;

export interface INotificationSubscriptionRecipientInput {
    userId: string;
    reason: NotificationReason;
}

export interface IUpdateResourceSubscriptionsParameters {
    resourceId: string;
    resourceType: SubscriptionResourceTypes;
    subscriptions: Array<{
        customId: string;
        recipients: INotificationSubscriptionRecipientInput[];
    }>;
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
