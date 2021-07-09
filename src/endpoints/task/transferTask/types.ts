import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicTask } from "../types";

export interface ITransferTaskParameters {
    taskId: string;
    boardId: string;
}

export interface ITransferTaskResult {
    task: IPublicTask;
}

export type TransferTaskEndpoint = Endpoint<
    IBaseContext,
    ITransferTaskParameters,
    ITransferTaskResult
>;
