import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicBoard } from "../types";

export interface IGetOrgBoardsParameters {
    orgId: string;
}

export interface IGetOrgBoardsResult {
    boards: IPublicBoard[];
}

export type GetOrgBoardsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgBoardsParameters,
    IGetOrgBoardsResult
>;
