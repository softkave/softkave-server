import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomSelectionOption } from "../types";

export interface IUpdateCustomSelectionOptionEndpointParams {
    customId: string;
    data: Partial<{
        name: string;
        description?: string;
        color?: string;
        prevOptionId?: string;
        nextOptionId?: string;
    }>;
}

export interface IUpdateCustomSelectionOptionEndpointResult {
    option: IPublicCustomSelectionOption;
}

export type UpdateCustomSelectionOptionEndpoint = Endpoint<
    IBaseContext,
    IUpdateCustomSelectionOptionEndpointParams,
    IUpdateCustomSelectionOptionEndpointResult
>;
