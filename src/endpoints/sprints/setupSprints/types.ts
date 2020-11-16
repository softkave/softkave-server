import { SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicSprintOptions } from "../types";

export interface ISetupSprintsParameters {
    boardId: string;
    data: {
        duration: SprintDuration;
    };
}

export interface ISetupSprintsResult {
    sprintOptions: IPublicSprintOptions;
}

export type SetupSprintsEndpoint = Endpoint<
    IBaseContext,
    ISetupSprintsParameters,
    ISetupSprintsResult
>;
