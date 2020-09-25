import { ISprint } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISetupSprintsParameters {
    duration: string;
    boardId: string;
}

export type SetupSprintsEndpoint = Endpoint<
    IBaseContext,
    ISetupSprintsParameters,
    ISprint
>;
