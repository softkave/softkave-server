import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISprintExistsParameters {
    name: string;
    boardId: string;
}

export type SprintExistsEndpoint = Endpoint<
    IBaseContext,
    ISprintExistsParameters,
    boolean
>;
