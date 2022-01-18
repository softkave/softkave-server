import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IEndSprintParameters {
    sprintId: string;
}

export interface IEndSprintResult {
    endDate: string;
}

export type EndSprintEndpoint = Endpoint<
    IBaseContext,
    IEndSprintParameters,
    IEndSprintResult
>;
