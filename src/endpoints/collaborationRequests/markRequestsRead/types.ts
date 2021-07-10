import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IMarkRequestsReadParameters {
    requestIds: Array<string>;
}

export type MarkRequestsReadEndpoint = Endpoint<
    IBaseContext,
    IMarkRequestsReadParameters
>;
