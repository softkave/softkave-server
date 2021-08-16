import {
    CustomPropertyType,
    ICustomPropertyValue,
} from "../../../mongo/custom-property/definitions";
import { IParentInformation } from "../../../mongo/definitions";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IUpdateValueEndpointParams {
    propertyId: string;
    parent: IParentInformation;
    type: CustomPropertyType;
    data: {
        value: ICustomPropertyValue["value"];
    };
}

export interface IUpdateValueEndpointResult {
    value: IPublicCustomPropertyValue;
}

export type UpdateValueEndpoint = Endpoint<
    IBaseContext,
    IUpdateValueEndpointParams,
    IUpdateValueEndpointResult
>;
