import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicRoleData } from "../types";

export interface IGetRolesParameters {
    blockId: string;
}

export interface IGetRolesResult {
    roles: IPublicRoleData[];
}

export type GetRolesEndpoint = Endpoint<
    IBaseContext,
    IGetRolesParameters,
    IGetRolesResult
>;
