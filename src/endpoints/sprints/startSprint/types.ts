import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IStartSprintParameters {
    sprintId: string;
}

export interface IStartSprintResult {
    startDate: string;
}

export type StartSprintEndpoint = Endpoint<
    IBaseContext,
    IStartSprintParameters,
    IStartSprintResult
>;
