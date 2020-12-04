import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IMarkNotificationReadParameters {
    notifications: Array<{ customId: string; readAt?: number }>;
}

export interface IMarkNotificationReadResult {
    notifications: Array<{ customId: string; readAt: string }>;
}

export type MarkNotificationReadEndpoint = Endpoint<
    IBaseContext,
    IMarkNotificationReadParameters
>;
