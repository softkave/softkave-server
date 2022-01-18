import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IDeleteTaskParameters {
    taskId: string;
}

export type DeleteTaskEndpoint = Endpoint<IBaseContext, IDeleteTaskParameters>;
