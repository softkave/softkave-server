import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomSelectionOption } from "../types";

export interface ICreateCustomSelectionOptionEndpointParams {
    propertyId: string;
    data: {
        name: string;
        description?: string;
        color?: string;
        prevOptionId?: string;
    };
}

export interface ICreateCustomSelectionOptionEndpointResult {
    option: IPublicCustomSelectionOption;
}

export type CreateCustomSelectionOptionEndpoint = Endpoint<
    IBaseContext,
    ICreateCustomSelectionOptionEndpointParams,
    ICreateCustomSelectionOptionEndpointResult
>;
