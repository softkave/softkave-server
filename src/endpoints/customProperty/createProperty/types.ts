import { CustomPropertyType } from "../../../mongo/custom-property/definitions";
import { IParentInformation } from "../../../mongo/definitions";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomProperty } from "../types";

export interface ICreatePropertyEndpointParams {
    parent: IParentInformation;
    property: {
        name: string;
        description?: string;
        type: CustomPropertyType;
        isRequired?: boolean;
        meta: any;
    };
}

export interface ICreatePropertyEndpointResult {
    property: IPublicCustomProperty;
}

export type CreatePropertyEndpoint = Endpoint<
    IBaseContext,
    ICreatePropertyEndpointParams,
    ICreatePropertyEndpointResult
>;
