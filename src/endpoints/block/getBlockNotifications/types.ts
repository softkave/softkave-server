import { INotification } from "../../../mongo/notification";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetBlockNotificationsParameters {
  blockId: string;
}

export interface IGetBlockNotificationsResult {
  notifications: INotification[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
  IBaseContext,
  IGetBlockNotificationsParameters,
  IGetBlockNotificationsResult
>;
