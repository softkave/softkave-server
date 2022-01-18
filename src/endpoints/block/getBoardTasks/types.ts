import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicBlock } from "../types";

export interface IGetBoardTasksParameters {
    boardId: string;
}

export interface IGetBoardTasksResult {
    tasks: IPublicBlock[];
}

export type GetBoardTasksEndpoint = Endpoint<
    IBaseContext,
    IGetBoardTasksParameters,
    IGetBoardTasksResult
>;
