import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCustomSelectionOption } from "../types";

export interface IChangeOptionPositionEndpointParams {
    customId: string;
    prevOptionId?: string;
}

export interface IChangeOptionPositionEndpointResult {
    option: IPublicCustomSelectionOption;
}

export type ChangeOptionPositionEndpoint = Endpoint<
    IBaseContext,
    IChangeOptionPositionEndpointParams,
    IChangeOptionPositionEndpointResult
>;
