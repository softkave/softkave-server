import { SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicSprintOptions } from "../types";

export interface IUpdateSprintOptionsParameters {
    boardId: string;
    data: {
        duration: SprintDuration;
    };
}

export interface IUpdateSprintOptionsResult {
    sprintOptions: IPublicSprintOptions;
}

export type UpdateSprintOptionsEndpoint = Endpoint<
    IBaseContext,
    IUpdateSprintOptionsParameters,
    IUpdateSprintOptionsResult
>;
