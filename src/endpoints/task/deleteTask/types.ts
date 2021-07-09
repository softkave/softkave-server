import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteTaskParameters {
    taskId: string;
}

export type DeleteTaskEndpoint = Endpoint<IBaseContext, IDeleteTaskParameters>;
