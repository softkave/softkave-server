import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicRoleData } from "../types";

export interface IRoleInput {
    name: string;
    description?: string;
    prevRoleId?: string;
    nextRoleId?: string;
}

export interface ISetRolesEndpointParameters {
    blockId: string;
    roles: {
        add: Array<{ tempId: string; data: IRoleInput }>;
        update: Array<{
            customId: string;
            data: Partial<IRoleInput>;
        }>;
        remove: string[];
    };
}

export interface ISetRolesEndpointResult {
    added: Array<{ tempId: string; role: IPublicRoleData }>;
    updated: Array<{ customId: string; updatedAt: string; updatedBy: string }>;
}

export type SetRolesEndpoint = Endpoint<
    IBaseContext,
    ISetRolesEndpointParameters,
    ISetRolesEndpointResult
>;
