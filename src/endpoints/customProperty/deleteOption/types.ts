import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IDeleteOptionEndpointParams {
    customId: string;
}

export type DeleteOptionEndpoint = Endpoint<
    IBaseContext,
    IDeleteOptionEndpointParams
>;
