import {
    CustomPropertyType,
    IDateCustomTypeValue,
    INumberCustomTypeValue,
    ITextCustomTypeValue,
} from "../../../mongo/custom-property/definitions";
import { IParentInformation } from "../../../mongo/definitions";
import { Join, PathsToStringProps } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IInsertCustomValueEndpointParams {
    propertyId: string;
    parent: IParentInformation;
    type: CustomPropertyType;
    data: {
        value:
            | string[]
            | ITextCustomTypeValue
            | IDateCustomTypeValue
            | INumberCustomTypeValue;
    };
}

export type IInsertCustomValueEndpointParamsFields = Join<
    PathsToStringProps<IInsertCustomValueEndpointParams>,
    "."
>;

export interface IInsertCustomValueEndpointResult {
    value: IPublicCustomPropertyValue;
}

export type InsertCustomValueEndpoint = Endpoint<
    IBaseContext,
    IInsertCustomValueEndpointParams,
    IInsertCustomValueEndpointResult
>;
