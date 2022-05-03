import { SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicSprint } from "../types";

export interface IUpdateSprintParameters {
    sprintId: string;
    data: {
        name?: string;
        duration?: SprintDuration;
        startDate?: string;
        endDate?: string;
    };
}

export interface IUpdateSprintResult {
    sprint: IPublicSprint;
}

export type UpdateSprintEndpoint = Endpoint<
    IBaseContext,
    IUpdateSprintParameters,
    IUpdateSprintResult
>;
