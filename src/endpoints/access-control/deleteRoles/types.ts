import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteRolesEndpointParameters {
    blockId: string;
    roles: string[];
}

export type DeleteRolesEndpoint = Endpoint<
    IBaseContext,
    IDeleteRolesEndpointParameters
>;
