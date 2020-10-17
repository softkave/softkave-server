import { BlockType, IBlock } from "../../../mongo/block";
import { ISprint } from "../../../mongo/sprint";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetSprintsParameters {
    boardId: string;
}

export type GetSprintsEndpoint = Endpoint<
    IBaseContext,
    IGetSprintsParameters,
    ISprint[]
>;
