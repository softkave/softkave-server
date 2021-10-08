import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomSelectionOption } from "../types";

export interface IUpdateOptionEndpointParams {
    customId: string;
    data: Partial<{
        name: string;
        description: string;
        color: string;
    }>;
}

export interface IUpdateOptionEndpointResult {
    option: IPublicCustomSelectionOption;
}

export type UpdateOptionEndpoint = Endpoint<
    IBaseContext,
    IUpdateOptionEndpointParams,
    IUpdateOptionEndpointResult
>;
