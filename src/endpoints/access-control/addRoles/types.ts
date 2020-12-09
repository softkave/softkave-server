import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicRoleData } from "../types";

export interface IRoleInput {
    name: string;
    description?: string;
    prevRoleId?: string;
    nextRoleId?: string;
}

export interface IAddRolesEndpointParameters {
    blockId: string;
    roles: Array<{ tempId: string; data: IRoleInput }>;
}

export interface IAddRolesEndpointResult {
    roles: Array<{ tempId: string; role: IPublicRoleData }>;
}

export type AddRolesEndpoint = Endpoint<
    IBaseContext,
    IAddRolesEndpointParameters,
    IAddRolesEndpointResult
>;
