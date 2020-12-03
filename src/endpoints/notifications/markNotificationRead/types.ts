import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IMarkNotificationReadParameters {
    notificationId: string;
    readAt: string;
}

export type MarkNotificationReadEndpoint = Endpoint<
    IBaseContext,
    IMarkNotificationReadParameters
>;
