import { SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUpdateSprintOptionsParameters {
    boardId: string;
    data: {
        duration: SprintDuration;
    };
}

export interface IUpdateSprintOptionsResult {
    data: { updatedAt: string };
}

export type UpdateSprintOptionsEndpoint = Endpoint<
    IBaseContext,
    IUpdateSprintOptionsParameters,
    IUpdateSprintOptionsResult
>;