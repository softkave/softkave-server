import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IMarkRequestReadParameters {
    requestId: string;
}

export type MarkRequestReadEndpoint = Endpoint<
    IBaseContext,
    IMarkRequestReadParameters
>;
