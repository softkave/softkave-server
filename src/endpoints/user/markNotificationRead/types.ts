import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IMarkNotificationReadParameters {
  customId: string;
  readAt: string;
}

export type MarkNotificationReadEndpoint = Endpoint<
  IBaseContext,
  IMarkNotificationReadParameters
>;
