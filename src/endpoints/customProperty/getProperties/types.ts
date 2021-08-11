import { IParentInformation } from "../../../mongo/definitions";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomProperty } from "../types";

export interface IGetPropertiesEndpointParams {
    parentId: string;
}

export interface IGetPropertiesEndpointResult {
    properties: IPublicCustomProperty[];
}

export type GetPropertiesEndpoint = Endpoint<
    IBaseContext,
    IGetPropertiesEndpointParams,
    IGetPropertiesEndpointResult
>;
