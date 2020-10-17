import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IStartSprintParameters {
    sprintId: string;
}

export type StartSprintEndpoint = Endpoint<
    IBaseContext,
    IStartSprintParameters
>;
