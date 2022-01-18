import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicBoard } from "../types";

export interface IGetOrganizationBoardsParameters {
    organizationId: string;
}

export interface IGetOrganizationBoardsResult {
    boards: IPublicBoard[];
}

export type GetOrganizationBoardsEndpoint = Endpoint<
    IBaseContext,
    IGetOrganizationBoardsParameters,
    IGetOrganizationBoardsResult
>;
