import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicBlock } from "../types";

export interface IGetOrganizationBoardsParameters {
    organizationId: string;
}

export interface IGetOrganizationBoardsResult {
    boards: IPublicBlock[];
}

export type GetOrganizationBoardsEndpoint = Endpoint<
    IBaseContext,
    IGetOrganizationBoardsParameters,
    IGetOrganizationBoardsResult
>;
