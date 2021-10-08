import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeleteOptionEndpointParams {
    customId: string;
}

export type DeleteOptionEndpoint = Endpoint<
    IBaseContext,
    IDeleteOptionEndpointParams
>;
