import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicTask } from "../types";

export interface IGetTaskParameters {
  taskId: string;
}

export interface IGetTaskEndpointResult {
  task: IPublicTask;
}

export type GetTaskEndpoint = Endpoint<IBaseContext, IGetTaskParameters>;
