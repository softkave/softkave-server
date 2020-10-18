import { ISprint } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IAddSprintParameters {
    boardId: string;
    name?: string;
}

export type AddSprintEndpoint = Endpoint<
    IBaseContext,
    IAddSprintParameters,
    { sprint: ISprint }
>;
