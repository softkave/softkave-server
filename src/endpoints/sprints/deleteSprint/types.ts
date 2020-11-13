import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteSprintParameters {
    sprintId: string;
}

export type DeleteSprintEndpoint = Endpoint<
    IBaseContext,
    IDeleteSprintParameters
>;
