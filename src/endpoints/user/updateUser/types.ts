import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IUpdateUserParameters {
  name?: string;
  email?: string;
  lastNotificationCheckTime?: number;
  color?: string;
}

export interface IUpdateUserContext extends IBaseEndpointContext {
  data: IUpdateUserParameters;
}
