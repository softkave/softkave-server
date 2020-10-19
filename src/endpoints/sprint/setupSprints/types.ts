import { SprintDuration } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISetupSprintsParameters {
    duration: SprintDuration;
    boardId: string;
}

export type SetupSprintsEndpoint = Endpoint<
    IBaseContext,
    ISetupSprintsParameters
>;
