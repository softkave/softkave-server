import { SystemResourceType } from "../../../models/system";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IAddToRoomInput {
  type: SystemResourceType;
  customId: string;
  subRoom?: SystemResourceType.Sprint | SystemResourceType.Task;
}

export interface ISubscribeParameters {
  rooms: IAddToRoomInput[];
}

export type SubscribeEndpoint = Endpoint<IBaseContext, ISubscribeParameters>;
