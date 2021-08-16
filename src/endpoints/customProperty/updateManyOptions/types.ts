import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomSelectionOption } from "../types";

export interface IUpdateManyOptionsEndpointParams {
    options: Array<{
        customId: string;
        data: Partial<{
            name: string;
            description?: string;
            color?: string;
            prevOptionId?: string;
            nextOptionId?: string;
        }>;
    }>;
}

export interface IUpdateManyOptionsEndpointResult {
    options: IPublicCustomSelectionOption[];
}

export type UpdateManyOptionsEndpoint = Endpoint<
    IBaseContext,
    IUpdateManyOptionsEndpointParams,
    IUpdateManyOptionsEndpointResult
>;
