import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomPropertyValue } from "../types";

export interface IUpdateValueEndpointParams {
    customId: string;
    data: Partial<{
        value: any;
    }>;
}

export interface IUpdateValueEndpointResult {
    value: IPublicCustomPropertyValue;
}

export type UpdateValueEndpoint = Endpoint<
    IBaseContext,
    IUpdateValueEndpointParams,
    IUpdateValueEndpointResult
>;
