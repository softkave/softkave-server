import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IDeletePropertyEndpointParams {
    customId: string;
}

export type DeletePropertyEndpoint = Endpoint<
    IBaseContext,
    IDeletePropertyEndpointParams
>;
