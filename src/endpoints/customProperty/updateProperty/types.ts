import { CustomPropertyType } from "../../../mongo/custom-property/definitions";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomProperty } from "../types";

export interface IUpdatePropertyEndpointParams {
    customId: string;
    property: Partial<{
        name: string;
        description: string;
        type: CustomPropertyType;
        isRequired: string;
        meta: any;
    }>;
}

export interface IUpdatePropertiesResult {
    property: IPublicCustomProperty;
}

export type UpdatePropertiesEndpoint = Endpoint<
    IBaseContext,
    IUpdatePropertyEndpointParams,
    IUpdatePropertiesResult
>;
