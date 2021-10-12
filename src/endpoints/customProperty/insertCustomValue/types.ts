import {
    CustomPropertyType,
    ICustomPropertyValue,
} from "../../../mongo/custom-property/definitions";
import { IParentInformation } from "../../../mongo/definitions";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IInsertCustomValueEndpointParams {
    propertyId: string;
    parent: IParentInformation;
    type: CustomPropertyType;
    data: {
        value: string[] | ICustomPropertyValue["value"];
    };
}

export interface IInsertCustomValueEndpointResult {
    value: IPublicCustomPropertyValue;
}

export type InsertCustomValueEndpoint = Endpoint<
    IBaseContext,
    IInsertCustomValueEndpointParams,
    IInsertCustomValueEndpointResult
>;
