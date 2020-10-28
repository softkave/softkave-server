import { SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUpdateSprintParameters {
    sprintId: string;
    data: {
        name?: string;
        duration?: SprintDuration;
    };
}

export interface IUpdateSprintResult {
    data: {
        updatedAt: string;
    };
}

export type UpdateSprintEndpoint = Endpoint<
    IBaseContext,
    IUpdateSprintParameters,
    IUpdateSprintResult
>;
