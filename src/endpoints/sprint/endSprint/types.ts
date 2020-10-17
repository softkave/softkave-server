import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IEndSprintsParameters {
    sprintId: string;
}

export type EndSprintEndpoint = Endpoint<IBaseContext, IEndSprintsParameters>;
