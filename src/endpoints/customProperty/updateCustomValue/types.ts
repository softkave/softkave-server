import { ICustomPropertyValue } from "../../../mongo/custom-property/definitions";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint, IUpdateComplexTypeArrayInput } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IUpdateCustomValueEndpointParams {
    customId: string;
    data: {
        value: IUpdateComplexTypeArrayInput<ICustomPropertyValue["value"]>;
    };
}

export interface IUpdateCustomValueEndpointResult {
    value: IPublicCustomPropertyValue;
}

export type UpdateCustomValueEndpoint = Endpoint<
    IBaseContext,
    IUpdateCustomValueEndpointParams,
    IUpdateCustomValueEndpointResult
>;
