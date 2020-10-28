import { ISprint } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetSprintsParameters {
    boardId: string;
}

export type GetSprintsEndpoint = Endpoint<
    IBaseContext,
    IGetSprintsParameters,
    { data: ISprint[] }
>;
