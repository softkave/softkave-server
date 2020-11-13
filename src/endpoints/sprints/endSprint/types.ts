import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IEndSprintParameters {
    sprintId: string;
}

export interface IEndSprintResult {
    data: {
        endDate: string;
    };
}

export type EndSprintEndpoint = Endpoint<
    IBaseContext,
    IEndSprintParameters,
    IEndSprintResult
>;
