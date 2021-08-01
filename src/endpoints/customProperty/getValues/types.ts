import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IGetValuesEndpointParams {
    propertyIds: string[];
}

export interface IGetValuesEndpointResult {
    values: IPublicCustomPropertyValue[];
}

export type GetValuesEndpoint = Endpoint<
    IBaseContext,
    IGetValuesEndpointParams,
    IGetValuesEndpointResult
>;
