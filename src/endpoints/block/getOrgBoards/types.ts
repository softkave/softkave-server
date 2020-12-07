import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicBlock } from "../types";

export interface IGetOrgBoardsParameters {
    orgId: string;
}

export interface IGetOrgBoardsResult {
    boards: IPublicBlock[];
}

export type GetOrgBoardsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgBoardsParameters,
    IGetOrgBoardsResult
>;
