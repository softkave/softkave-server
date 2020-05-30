import { Endpoint } from "../../types";
import { IBaseContext } from "../../contexts/BaseContext";

export interface IUpdateUserParameters {
  name?: string;
  email?: string;
  lastNotificationCheckTime?: number;
  color?: string;
}

export type UpdateUserEndpoint = Endpoint<IBaseContext, IUpdateUserParameters>;
