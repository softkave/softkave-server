import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeletePropertyEndpointParams {
    customId: string;
}

export type DeletePropertyEndpoint = Endpoint<
    IBaseContext,
    IDeletePropertyEndpointParams
>;
