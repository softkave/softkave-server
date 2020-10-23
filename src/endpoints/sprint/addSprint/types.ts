import { ISprint, SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IAddSprintParameters {
    boardId: string;
    data: {
        name: string;
        duration: SprintDuration;
    };
}

export type AddSprintEndpoint = Endpoint<
    IBaseContext,
    IAddSprintParameters,
    { data: ISprint }
>;
