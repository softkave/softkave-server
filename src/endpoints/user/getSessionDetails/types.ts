import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IGetSessionDetailsContext extends IBaseEndpointContext {
  getNotificationsCount: (email: string) => Promise<number>;
  getAssignedTasksCount: (customId: string) => Promise<number>;
  getOrgsCount: (UOL: number) => Promise<number>;
}
