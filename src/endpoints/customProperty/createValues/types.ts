import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface ICreateValuesEndpointParams {
    values: Array<{
        propertyId: string;
        value: any;
    }>;
}

export interface ICreateValuesEndpointResult {
    values: IPublicCustomPropertyValue[];
}

export type CreateValuesEndpoint = Endpoint<
    IBaseContext,
    ICreateValuesEndpointParams,
    ICreateValuesEndpointResult
>;
