import { IBaseContext } from "../../contexts/IBaseContext";
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
