import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IRoleInput } from "../addRoles/types";

export interface IUpdateRolesEndpointParameters {
    blockId: string;
    roles: Array<{
        customId: string;
        data: Partial<IRoleInput>;
    }>;
}

export interface IUpdateRolesEndpointResult {
    roles: Array<{ customId: string; updatedAt: string; updatedBy: string }>;
}

export type UpdateRolesEndpoint = Endpoint<
    IBaseContext,
    IUpdateRolesEndpointParameters,
    IUpdateRolesEndpointResult
>;
